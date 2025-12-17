const db = require('../db/index')
const jwt = require("jsonwebtoken")
const jwtSecretKey = `abc81030839`
const multer = require("multer")
const crypto = require("crypto")
const path = require('path')
const baseUrl = require("../baseUrl")

// 图片上传配置（用户头像上传，存储到 public/user 目录）
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/user'); // 与 admin 区分，单独存储用户头像
    },
    filename: function (req, file, cb) {
        const randomString = crypto.randomBytes(8).toString('hex');
        const extension = path.extname(file.originalname);
        const uniqueFileName = `${file.fieldname}-${Date.now()}-${randomString}${extension}`;
        cb(null, uniqueFileName);
    },
});
const upload = multer({ storage: storage });

// 1. 用户头像上传接口
const uploadUserAvatar = (req, res) => {
    upload.single('avatar')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                status: 400,
                message: '头像上传出错: ' + err
            });
        } else if (err) {
            return res.status(500).json({
                status: 500,
                message: '服务器错误: ' + err
            });
        }
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: '未上传头像文件'
            });
        }
        // 拼接头像完整 URL（与 admin 图片路径区分）
        const avatarUrl = `http://${baseUrl}/user/${req.file.filename}`;
        return res.send({
            status: 200,
            message: "头像上传成功",
            avatarUrl: avatarUrl
        })
    })
}

// 2. 查询所有用户（分页可选，避免数据量过大）
const getUserList = (req, res) => {
    // 支持分页查询（page=页码，limit=每页条数），默认查询所有
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000; // 默认最多返回1000条
    const offset = (page - 1) * limit;

    // 查询用户列表（隐藏敏感字段，只返回必要信息）
    const sql = `select id, openid, nickname, avatarurl, gender, create_time, balance from user limit ? offset ?`;
    db.query(sql, [limit, offset], (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库查询出错: ' + err
            });
        }
        // 可选：查询总条数（用于分页）
        const countSql = `select count(*) as total from user`;
        db.query(countSql, (countErr, countResult) => {
            if (countErr) {
                return res.send({
                    status: 500,
                    message: '查询用户总数出错: ' + countErr
                });
            }
            res.send({
                status: 200,
                message: '查询用户列表成功',
                data: {
                    list: result,
                    total: countResult[0].total,
                    page,
                    limit
                }
            })
        })
    })
}

// 3. 根据ID查询单个用户
const getUserById = (req, res) => {
    const sql = `select id, openid, nickname, avatarurl, gender, create_time, balance from user where id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库查询出错: ' + err
            });
        }
        if (result.length === 0) {
            return res.send({
                status: 404,
                message: '用户不存在'
            });
        }
        res.send({
            status: 200,
            message: '查询用户成功',
            data: result[0]
        })
    })
}

// 4. 新增用户（支持普通用户注册/后台添加用户）
const addUser = (req, res) => {
    // 校验 openid 是否已存在（openid 通常唯一标识用户）
    const checkSql = `select * from user where openid = ?`;
    db.query(checkSql, [req.body.openid], (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库查询出错: ' + err
            });
        }
        if (result.length > 0) {
            return res.send({
                status: 400,
                message: '该用户已存在（openid 重复）'
            });
        }

        // 插入新用户（字段与 user 表匹配）
        const insertSql = `insert into user (openid, nickname, avatarurl, gender, create_time, balance) values(?, ?, ?, ?, ?, ?)`;
        const values = [
            req.body.openid,
            req.body.nickname || '默认用户', // 昵称默认值
            req.body.avatarurl || '', // 头像可选
            req.body.gender || 0, // 性别默认 0（未知），1=男，2=女
            req.body.create_time || new Date().toISOString(), // 创建时间默认当前时间
            req.body.balance || 0 // 初始余额默认 0
        ];

        db.query(insertSql, values, (err, result) => {
            if (err) {
                return res.send({
                    status: 500,
                    message: '数据库插入出错: ' + err
                });
            }
            res.send({
                status: 200,
                message: '新增用户成功',
                data: {
                    userId: result.insertId,
                    nickname: values[1]
                }
            })
        })
    })
}

// 5. 修改用户信息（支持更新昵称、头像、性别、余额等）
const updateUser = (req, res) => {
    // 先查询用户是否存在
    const checkSql = `select * from user where id = ?`;
    db.query(checkSql, [req.params.id], (err, oldResult) => {
        if (err) {
            return res.send({
                status: 500,
                message: '查询用户数据出错: ' + err
            });
        }
        if (oldResult.length === 0) {
            return res.send({
                status: 404,
                message: '用户不存在'
            });
        }

        // 构建更新字段（支持部分字段更新，未传则保留原数据）
        const updateData = {
            nickname: req.body.nickname || oldResult[0].nickname,
            avatarurl: req.body.avatarurl || oldResult[0].avatarurl,
            gender: req.body.gender !== undefined ? req.body.gender : oldResult[0].gender,
            balance: req.body.balance !== undefined ? req.body.balance : oldResult[0].balance,
            // 可根据需求添加其他可修改字段
        };

        const updateSql = `update user set nickname = ?, avatarurl = ?, gender = ?, balance = ? where id = ?`;
        const values = [
            updateData.nickname,
            updateData.avatarurl,
            updateData.gender,
            updateData.balance,
            req.params.id
        ];

        db.query(updateSql, values, (updateErr, updateResult) => {
            if (updateErr) {
                return res.send({
                    status: 500,
                    message: '数据库更新出错: ' + updateErr
                });
            }
            if (updateResult.affectedRows === 0) {
                return res.send({
                    status: 404,
                    message: '用户不存在'
                });
            }
            res.send({
                status: 200,
                message: '修改用户信息成功',
                data: updateData
            });
        });
    });
};

// 6. 删除用户
const deleteUser = (req, res) => {
    const sql = `delete from user where id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库删除出错: ' + err
            });
        }
        if (result.affectedRows === 0) {
            return res.send({
                status: 404,
                message: '用户不存在'
            });
        }
        res.send({
            status: 200,
            message: '删除用户成功'
        })
    })
}

// 7. 可选：根据 openid 查询用户（微信/第三方登录常用）
const getUserByOpenid = (req, res) => {
    const sql = `select id, openid, nickname, avatarurl, gender, create_time, balance from user where openid = ?`;
    db.query(sql, [req.params.openid], (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库查询出错: ' + err
            });
        }
        if (result.length === 0) {
            return res.send({
                status: 404,
                message: '用户不存在'
            });
        }
        res.send({
            status: 200,
            message: '查询用户成功',
            data: result[0]
        })
    })
}

module.exports = {
    uploadUserAvatar,
    getUserList,
    getUserById,
    getUserByOpenid,
    addUser,
    updateUser,
    deleteUser
}