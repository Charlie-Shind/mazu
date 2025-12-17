const db = require('../db/index')
const jwt = require("jsonwebtoken")
const jwtSecretKey = `abc81030839`
const multer = require("multer")
const crypto = require("crypto")
const path = require('path')
const baseUrl = require("../baseUrl")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/prays'); // 上传的文件存储在 /community/post 目录中
    },
    filename: function (req, file, cb) {
        const randomString = crypto.randomBytes(8).toString('hex');
        const extension = path.extname(file.originalname);
        const uniqueFileName = `${file.fieldname}-${Date.now()}-${randomString}${extension}`;
        cb(null, uniqueFileName); // 使用随机字符串来确保文件名的唯一性
    },
});
const upload = multer({ storage: storage });


// 随机获取祈福数据
const getRandomPrays = (req, res) => {
    const authorization = req.headers.Authorization;
    const token = Authorization ? authorization.split(' ')[1] : null;
    if (!token) {
        return res.send({
            status: 501,
            message: "暂无权限"
        });
    }
    // 解码 token  
    const decoded = jwt.decode(token);
    // 验证 token  
    if (!jwt.verify(token, jwtSecretKey)) {
        return res.send({
            status: 501,
            message: "无效的令牌"
        });
    }
    const sql = `SELECT * FROM mz_prays ORDER BY RANDOM() LIMIT 1`;
    db.query(sql, (error, results) => {
        if (error) {
            console.error('数据库查询错误:', error);
            return res.send({
                status: 500,
                message: "数据库查询出错"
            });
        }

        if (results.length > 0) {
            return res.send({
                status: 200,
                data: results[0]
            });
        } else {
            return res.send({
                status: 404,
                message: "未找到祈福数据"
            });
        }
    });
}


// 后台管理系统接口
// ==========================================================================================================================================
// 后台管理系统接口


// 获取全部祈福数据（使用分页）
const getAllPrays = (req, res) => {
    // const token = req.headers.Authorization?.split(' ')[1];
    // if (!token) {
    //     return res.send({
    //         status: 501,
    //         message: "暂无权限"
    //     });
    // }
    // const decoded = jwt.decode(token);
    // if (!jwt.verify(token, jwtSecretKey)) {
    //     return res.send({
    //         status: 501,
    //         message: "无效的令牌"
    //     });
    // }

    const page = parseInt(req.query.page) || 1; // 获取页码，默认为1
    const pageSize = parseInt(req.query.pageSize) || 10; // 获取每页数据条数，默认为10

    const offset = (page - 1) * pageSize; // 计算偏移量，用于确定从哪条记录开始查询

    const sql = `SELECT * FROM mz_prays LIMIT ?,?`;
    const values = [offset, pageSize];
    db.query(sql, values, (error, results) => {
        if (error) {
            console.error('数据库查询错误:', error);
            return res.send({
                status: 500,
                message: "数据库查询出错"
            });
        }

        const countSql = `SELECT COUNT(*) as totalCount FROM mz_prays`;
        db.query(countSql, (countError, countResults) => {
            if (countError) {
                console.error('获取数据总数错误:', countError);
                return res.send({
                    status: 500,
                    message: "获取数据总数出错"
                });
            }

            const totalCount = countResults[0].totalCount; // 获取总记录数
            const totalPages = Math.ceil(totalCount / pageSize); // 计算总页数

            return res.send({
                status: 200,
                message: "获取数据成功",
                data: results,
                currentPage: page,
                pageSize: pageSize,
                totalCount: totalCount,
                totalPages: totalPages
            });
        });
    });
};

// 上传祈福图片
const uploadPraysImage = (req, res) => {
    // const token = req.headers.Authorization?.split(' ')[1];
    // let decoded;
    // if (!token) {
    //     return res.send({
    //         status: 501,
    //         message: "暂无权限"
    //     })
    // }
    // if (jwt.verify(token, jwtSecretKey)) {
    //     decoded = jwt.decode(token);
    // } else {
    //     return res.send({
    //         status: 501,
    //         message: "无效的令牌"
    //     })
    // }

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
        const imageUrl = `http://${baseUrl}/prays/${req.file.filename}`;
        console.log(imageUrl);

        return res.send({
            status: 200,
            message: "图片上传成功",
            imageUrl: imageUrl
        })
    })
}

// 新增prays数据
const addPraysData = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.send({
            status: 501,
            message: "暂无权限"
        });
    }
    const decoded = jwt.decode(token);
    if (!jwt.verify(token, jwtSecretKey)) {
        return res.send({
            status: 501,
            message: "无效的令牌"
        });
    }

    const { image, content } = req.body;
    const sql = `INSERT INTO mz_prays (image, text) VALUES (?,?)`;
    const values = [image, content];
    db.query(sql, values, (error, results) => {
        if (error) {
            console.error('新增数据出错:', error);
            return res.send({
                status: 500,
                message: "新增数据失败"
            });
        }
        return res.send({
            status: 200,
            message: "新增数据成功",
            insertId: results.insertId
        });
    });
};

// 修改prays数据 
const updatePraysData = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.send({
            status: 501,
            message: "暂无权限"
        });
    }
    const decoded = jwt.decode(token);
    if (!jwt.verify(token, jwtSecretKey)) {
        return res.send({
            status: 501,
            message: "无效的令牌"
        });
    }

    const { id, image, content } = req.body;
    const sql = `UPDATE mz_prays SET image =?, text =? WHERE id =?`;
    const values = [image, content, id];
    db.query(sql, values, (error, results) => {
        if (error) {
            console.error('修改数据出错:', error);
            return res.send({
                status: 500,
                message: "修改数据失败" + error
            });
        }
        if (results.affectedRows > 0) {
            return res.send({
                status: 200,
                message: "修改数据成功"
            });
        } else {
            return res.send({
                status: 404,
                message: "未找到对应要修改的数据"
            });
        }
    });
};

// 删除prays数据（假设根据id来删除记录）
const deletePraysData = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.send({
            status: 501,
            message: "暂无权限"
        });
    }
    const decoded = jwt.decode(token);
    if (!jwt.verify(token, jwtSecretKey)) {
        return res.send({
            status: 501,
            message: "无效的令牌"
        });
    }
    const { id } = req.body;
    if (!Array.isArray(id) || id.length === 0) {
        return res.send({
            status: 400,
            message: "无效的id数组"
        });
    }
    const placeholders = id.map(() => '?').join(',');
    const sql = `DELETE FROM mz_prays WHERE id IN (${placeholders})`;
    const values = id;
    db.query(sql, values, (error, results) => {
        if (error) {
            console.error('删除数据出错:', error);
            return res.send({
                status: 500,
                message: "删除数据失败"
            });
        }
        if (results.affectedRows > 0) {
            return res.send({
                status: 200,
                message: "删除数据成功"
            });
        } else {
            return res.send({
                status: 404,
                message: "未找到对应要删除的数据"
            });
        }
    });
};

module.exports = {
    getRandomPrays,
    uploadPraysImage,
    addPraysData,
    updatePraysData,
    deletePraysData,
    getAllPrays
};