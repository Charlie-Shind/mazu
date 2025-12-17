const db = require('../db/index')
const jwt = require("jsonwebtoken")
const jwtSecretKey = `abc81030839`
const multer = require("multer")
const crypto = require("crypto")
const path = require('path')
const baseUrl = require("../baseUrl")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/admin');
    },
    filename: function (req, file, cb) {
        const randomString = crypto.randomBytes(8).toString('hex');
        const extension = path.extname(file.originalname);
        const uniqueFileName = `${file.fieldname}-${Date.now()}-${randomString}${extension}`;
        cb(null, uniqueFileName); // 使用随机字符串来确保文件名的唯一性
    },
});
const upload = multer({ storage: storage });

// 用户上传图片
const uploadAdminImage = (req, res) => {

    upload.single('img')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                status: 400,
                message: '文件上传出错' + err
            });
        } else if (err) {
            return res.status(500).json({
                status: 500,
                message: '服务器错误' + err
            });
        }
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: '未上传文件'
            });
        }
        const imageUrl = `http://${baseUrl}/admin/${req.file.filename}`;
        return res.send({
            status: 200,
            message: "图片上传成功",
            imageUrl: imageUrl
        })
    })
}
// 查询所有admin
const getAdminList = (req, res) => {
    const sql = `select id, username, imageUrl, roles from admin_user` // 可根据需求选择字段，避免返回密码
    db.query(sql, (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库查询出错: ' + err
            });
        }
        res.send({
            status: 200,
            message: result
        })
    })
}

// 根据ID查询单个admin
const getAdminById = (req, res) => {
    const sql = `select id, username, imageUrl, roles from admin_user where id = ?`
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
                message: '管理员不存在'
            });
        }
        res.send({
            status: 200,
            message: result[0]
        })
    })
}

// 新增admin
const addAdmin = (req, res) => {
    // 先校验用户名是否已存在
    const checkSql = `select * from admin_user where username = ?`
    db.query(checkSql, [req.body.username], (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库查询出错: ' + err
            });
        }
        if (result.length > 0) {
            return res.send({
                status: 400,
                message: '用户名已存在'
            });
        }
        // 插入新管理员
        const insertSql = `insert into admin_user (username, password, imageUrl, roles) values(?, ?, ?, ?)`
        const values = [
            req.body.username,
            req.body.password, // 实际项目中需加密，这里简化处理
            req.body.imageUrl || '',
            req.body.roles || 1 // 默认为普通权限
        ]
        db.query(insertSql, values, (err, result) => {
            if (err) {
                return res.send({
                    status: 500,
                    message: '数据库插入出错: ' + err
                });
            }
            res.send({
                status: 200,
                message: '新增管理员成功',
                insertId: result.insertId
            })
        })
    })
}

// 修改admin
const updateAdmin = (req, res) => {
    const getOldDataSql = `select password from admin_user where id = ?`;
    db.query(getOldDataSql, req.params.id, (err, oldResult) => {
        if (err) {
            return res.send({
                status: 500,
                message: '查询原有管理员数据出错: ' + err
            });
        }
        if (oldResult.length === 0) {
            return res.send({
                status: 404,
                message: '管理员不存在'
            });
        }

        const newPassword = req.body.password ? req.body.password : oldResult[0].password;

        const updateSql = `update admin_user set username = ?, password = ?, imageUrl = ?, roles = ? where id = ?`;
        const values = [
            req.body.username,
            newPassword,
            req.body.imageUrl || '',
            req.body.roles || 1,
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
                    message: '管理员不存在'
                });
            }
            res.send({
                status: 200,
                message: '修改管理员成功'
            });
        });
    });
};

// 删除admin
const deleteAdmin = (req, res) => {
    const sql = `delete from admin_user where id = ?`
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
                message: '管理员不存在'
            });
        }
        res.send({
            status: 200,
            message: '删除管理员成功'
        })
    })
}

module.exports = {
    getAdminList,
    getAdminById,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    uploadAdminImage
}