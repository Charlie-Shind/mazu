const db = require('../db/index')
const jwt = require("jsonwebtoken")
const axios = require("axios")
const jwtSecretKey = `abc81030839`
const multer = require("multer")
const crypto = require("crypto")
const path = require('path')
const baseUrl = require("../baseUrl")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/user/'); // 上传的文件存储在 /user/ 目录中
    },
    filename: function (req, file, cb) {
        const randomString = crypto.randomBytes(8).toString('hex');
        const extension = path.extname(file.originalname);
        const uniqueFileName = `${file.fieldname}-${Date.now()}-${randomString}${extension}`;
        cb(null, uniqueFileName); // 使用随机字符串来确保文件名的唯一性
    },
});
const upload = multer({ storage: storage });

let appid = `wx60f60f7e0a327265`
let secret = `2187fb1e1c2e0e3a0d57de0c75089737`
let grant_type = `authorization_code`

// 获取openid  
const wxGetOpenId = (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).send({
            message: "必填项不能为空"
        });
    }
    axios({
        url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=${grant_type}`,
        method: "GET"
    })
        .then(response => {
            return res.send({
                status: 200,
                message: response.data
            });
        })
        .catch(err => {
            return res.status(500).send({
                message: "获取 OpenId 失败: " + err.message,
            });
        });
};

// 根据openid登录  
const wxLogin = (req, res) => {
    const { openid, nickname, avatarurl, gender } = req.body;
    if (!openid) {
        return res.status(400).json({
            message: "必填项不能为空"
        });
    }

    const sql = `select * from user where openid = ?`;
    db.query(sql, [openid], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: '数据库查询出错: ' + err
            });
        } else {
            if (result.length === 0) {
                // 注册  
                const createTime = new Date().toISOString();
                const regSql = `insert into user (openid,nickname,avatarurl,gender,create_time) values (?,?,?,?,?)`;
                db.query(regSql, [openid, nickname, avatarurl, gender, createTime], (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({
                            message: '数据库插入出错: ' + err
                        });
                    }
                    res.send({
                        status: 200,
                        message: `注册成功`,
                        token: `Bearer ${jwt.sign({ openid }, jwtSecretKey, { expiresIn: '240000h' })}`,
                        user: {
                            id: result.insertId,
                            openid,
                            nickname,
                            avatarurl,
                            gender,
                            create_time: createTime,
                            balance: 0
                        }
                    });
                });
            } else if (result.length === 1) {
                // 登录  
                const token = jwt.sign({ openid }, jwtSecretKey, { expiresIn: '240000h' });
                return res.send({
                    status: 200,
                    message: "登录成功",
                    token: `Bearer ${token}`,
                    user: {
                        id: result[0].id,
                        openid: result[0].openid,
                        nickname: result[0].nickname,
                        avatarurl: result[0].avatarurl,
                        gender: result[0].gender,
                        create_time: result[0].create_time,
                        balance: result[0].balance
                    },
                });
            } else {
                res.status(500).send({
                    message: "数据库异常，请联系管理员"
                });
            }
        }
    });
};

// 修改昵称
const editNickname = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    let decoded;
    if (!token) {
        return res.send({
            status: 501,
            message: "暂无权限"
        })
    }
    if (jwt.verify(token, jwtSecretKey)) {
        decoded = jwt.decode(token);
    } else {
        return res.send({
            status: 501,
            message: "无效的令牌"
        })
    }
    const {
        id,
        name
    } = req.body
    const sql = `update user set nickname = ? where id = ?`
    db.query(sql, [name, id], (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库查询出错: ' + err
            });
        }
        res.send({
            status: 200,
            message: '昵称修改成功'
        })
    })
}

// 上传头像
const editUserHeaders = (req, res) => {
    const { id } = req.query;
    const token = req.headers.authorization?.split(' ')[1];
    let decoded;
    if (!token) {
        return res.send({
            status: 501,
            message: "暂无权限"
        })
    }
    if (jwt.verify(token, jwtSecretKey)) {
        decoded = jwt.decode(token);
    } else {
        return res.send({
            status: 501,
            message: "无效的令牌"
        })
    }
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

        // 拼接url
        const imageUrl = `http://${baseUrl}/user/${req.file.filename}`;
        const sql = `UPDATE user SET avatarurl = ? WHERE id = ?`;

        db.query(sql, [imageUrl, id], (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    message: '数据库查询出错: ' + err.message
                });
            }

            res.status(200).json({
                status: 200,
                message: '头像修改成功'
            });
        });
    });
};

// 统计用户访问次数
const userVisitCount = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    let decoded;
    if (!token) {
        return res.send({
            status: 501,
            message: "暂无权限",
        });
    }
    if (jwt.verify(token, jwtSecretKey)) {
        decoded = jwt.decode(token);
    } else {
        return res.send({
            status: 501,
            message: "无效的令牌",
        });
    }

    const {
        userId
    } = req.body

    // 获取当前日期 as：2024-09-30  
    const date = new Date().toISOString().slice(0, 10);

    // 查询当天的访问次数  
    const sql = `select visit_count from user_visit_count where visit_date = ? and user_id = ?`;
    db.query(sql, [date, userId], (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: "数据库查询出错" + err,
            });
        }
        if (result.length === 0) {
            const insertSql = `insert into user_visit_count (visit_date, visit_count, user_id) values (?, 1, ?)`;
            db.query(insertSql, [date, userId], (err, results) => {
                if (err) {
                    return res.send({
                        status: 500,
                        message: "数据库查询出错" + err,
                    });
                }
                return res.send({
                    status: 200,
                    message: "访问次数：1",
                });
            });
        } else {
            // 如果记录不是为0，有记录  
            const uploadSql = `update user_visit_count set visit_count = visit_count + 1 where visit_date = ? and user_id = ?`;
            db.query(uploadSql, [date, userId], (err, updateResults) => {
                if (err) {
                    return res.send({
                        status: 500,
                        message: "数据库更新出错" + err,
                    });
                }
                const selectSql = `select visit_count from user_visit_count where visit_date = ? and user_id = ?`;
                db.query(selectSql, [date, userId], (err, selectResults) => {
                    if (err) {
                        return res.send({
                            status: 500,
                            message: "数据库查询出错" + err,
                        });
                    }
                    return res.send({
                        status: 200,
                        message: `访问次数：${selectResults[0].visit_count}`,
                    });
                });
            });
        }
    });
};

// 统计访问次数（不仅限于用户）
const visitCount = (req, res) => {
    // 获取当前日期 as：2024-09-30  
    const date = new Date().toISOString().slice(0, 10);
    // 查询当天的访问次数  
    const sql = `select visit_count from visit_count where visit_date = ?`;
    db.query(sql, [date], (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: "数据库查询出错" + err,
            });
        }
        if (result.length === 0) {
            const insertSql = `insert into visit_count (visit_date, visit_count) values (?, 1)`;
            db.query(insertSql, [date], (err, result) => {
                if (err) {
                    return res.send({
                        status: 500,
                        message: "数据库查询出错" + err,
                    });
                }
                return res.send({
                    status: 200,
                    message: "今日访问次数：1",
                });
            });
        } else {
            // 如果记录不是为0，有记录  
            const uploadSql = `update visit_count set visit_count = visit_count + 1 where visit_date = ?`;
            db.query(uploadSql, [date], (err, result) => {
                if (err) {
                    return res.send({
                        status: 500,
                        message: "数据库查询出错" + err,
                    });
                }
                const selectSql = `select visit_count from visit_count where visit_date = ?`
                db.query(sql, [date], (err, selectResults) => {
                    if (err) {
                        return res.send({
                            status: 500,
                            message: `数据库查询出错：${err}`,
                        });
                    }
                    return res.send({
                        status: 200,
                        message: `今日访问次数：${selectResults[0].visit_count}`,
                    });
                })
            });
        }
    });
}

// 查询账户余额是否为0，是则返回false
const checkBalanceZero = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    let decoded;
    if (!token) {
        return res.send({
            status: 501,
            message: "暂无权限",
        });
    }
    if (jwt.verify(token, jwtSecretKey)) {
        decoded = jwt.decode(token);
    } else {
        return res.send({
            status: 501,
            message: "无效的令牌",
        });
    }

    const {
        openid
    } = req.body;

    const sql = `select balance from user where openid = ?`;
    db.query(sql, [openid], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({
                message: '数据库查询出错: ' + err
            });
        }
        if (result.length > 0 && result[0].balance <= 0) {
            return res.send({
                status: 200,
                message: false
            });
        }
        return res.send({
            status: 200,
            message: true,
        });
    });
};

// 给账户余额增加10000
const addBalance = (req, res) => {
    // const token = req.headers.authorization?.split(' ')[1];
    // let decoded;
    // if (!token) {
    //     return res.send({
    //         status: 501,
    //         message: "暂无权限"
    //     });
    // }
    // if (jwt.verify(token, jwtSecretKey)) {
    //     decoded = jwt.decode(token);
    // } else {
    //     return res.send({
    //         status: 501,
    //         message: "无效的令牌"
    //     });
    // }

    const {
        openid
    } = req.body;

    // 先查询当前余额
    const querySql = `select balance from user where openid =?`;
    db.query(querySql, [openid], (queryErr, queryResult) => {
        if (queryErr) {
            console.error(queryErr);
            return res.status(500).send({
                message: '数据库查询当前余额出错: ' + queryErr
            });
        }
        if (queryResult.length > 0) {
            const currentBalance = queryResult[0].balance;
            const newBalance = currentBalance + 10000;
            // 更新余额
            const updateSql = `update user set balance =? where openid =?`;
            db.query(updateSql, [newBalance, openid], (updateErr, updateResult) => {
                if (updateErr) {
                    console.error(updateErr);
                    return res.status(500).send({
                        message: '数据库更新余额出错: ' + updateErr
                    });
                }
                return res.send({
                    status: 200,
                    message: '余额更新成功',
                    balance: newBalance
                });
            });
        } else {
            return res.status(500).send({
                message: '未找到对应的用户记录，无法更新余额'
            });
        }
    });
};


// 签到功能
const signIn = (req, res) => {
    const {
        openid
    } = req.body;

    if (!openid) {
        return res.send({
            status: 400,
            message: "openid不能为空，请传入正确的用户标识"
        });
    }

    // 获取当前日期，格式化为 'YYYY-MM-DD'
    const currentDate = new Date().toISOString().slice(0, 10);

    // 先查询今天是否已经签到过
    const checkSql = `SELECT * FROM signin WHERE user_id = (SELECT id FROM user WHERE openid =?) AND sign_in_date =?`;
    db.query(checkSql, [openid, currentDate], (checkErr, checkResult) => {
        if (checkErr) {
            console.error(checkErr);
            return res.status(500).send({
                message: '数据库查询是否已签到出错: ' + checkErr
            });
        }
        if (checkResult.length > 0) {
            return res.send({
                status: 2001,
                message: '今天已经签到过了，无需重复签到'
            });
        }

        // 查询昨天是否签到过，用于判断连续签到天数
        const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        const prevCheckSql = `SELECT * FROM signin WHERE user_id = (SELECT id FROM user WHERE openid =?) AND sign_in_date =?`;
        db.query(prevCheckSql, [openid, yesterday], (prevCheckErr, prevCheckResult) => {
            if (prevCheckErr) {
                console.error(prevCheckErr);
                return res.status(500).send({
                    message: '数据库查询昨天签到情况出错: ' + prevCheckErr
                });
            }
            let continuousDays = 1; // 默认本次签到算连续签到1天
            if (prevCheckResult.length > 0) {
                continuousDays = prevCheckResult[0].is_continuous + 1;
            }

            // 插入签到记录
            const insertSql = `INSERT INTO signin (user_id, sign_in_date, is_continuous) VALUES ((SELECT id FROM user WHERE openid =?),?,?)`;
            db.query(insertSql, [openid, currentDate, continuousDays], (insertErr, insertResult) => {
                if (insertErr) {
                    console.error(insertErr);
                    return res.status(500).send({
                        message: '数据库插入签到记录出错: ' + insertErr
                    });
                }
                return res.send({
                    status: 2002,
                    message: '签到成功',
                    continuousDays: continuousDays
                });
            });
        });
    });
};

// 获取用户最新连续签到天数接口
const getContinuousSignInDays = (req, res) => {
    const {
        openid
    } = req.body;

    if (!openid) {
        return res.send({
            status: 400,
            message: "openid不能为空，请传入正确的用户标识"
        });
    }

    // 查询该用户的签到记录，按照签到日期倒序排列，获取最新的一条记录
    const querySql = `SELECT is_continuous FROM signin WHERE user_id = (SELECT id FROM user WHERE openid =?) ORDER BY sign_in_date DESC LIMIT 1`;
    db.query(querySql, [openid], (queryErr, queryResult) => {
        if (queryErr) {
            console.error(queryErr);
            return res.status(500).send({
                message: '数据库查询签到记录出错: ' + queryErr
            });
        }
        if (queryResult.length > 0) {
            return res.send({
                status: 200,
                message: '查询成功',
                continuousDays: queryResult[0].is_continuous
            });
        } else {
            return res.send({
                status: 200,
                message: '该用户暂无签到记录',
                continuousDays: 0
            });
        }
    });
};
// 后台管理系统接口
// ==========================================================================================================================================
// 后台管理系统接口

// 登录
const adminLogin = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({
            message: "账号或密码不能为空",
        });
    }

    const selectUser = `select id, password from admin_user where username = ?`;
    db.query(selectUser, [username], (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: `数据库查询出错：${err}`
            });
        }

        if (!result.length) {
            return res.send({
                status: 400,
                message: `该用户不存在`
            });
        }

        if (result[0].password !== password) {
            return res.send({
                status: 400,
                message: `用户名或密码出错`
            });
        }

        const token = jwt.sign({ userId: result[0].id }, jwtSecretKey, {
            expiresIn: '6h',
        });

        return res.send({
            status: 200,
            message: `登录成功`,
            token: `Bearer ` + token,
            user_id: result[0].id
        });
    });
};

// 获取所有用户信息
const adminGetUserInfo = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    let decoded;
    if (!token) {
        return res.send({
            status: 501,
            message: "暂无权限"
        })
    }
    if (jwt.verify(token, jwtSecretKey)) {
        decoded = jwt.decode(token);
    } else {
        return res.send({
            status: 501,
            message: "无效的令牌"
        })
    }
    const {
        id
    } = req.body
    const selectSql = `select * from admin_user where id = ?`
    db.query(selectSql, [id], (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: `数据库查询出错：${err}`,
            });
        }

        if (!result.length) {
            return res.send({
                status: 400,
                message: `该用户不存在`
            });
        }

        res.send({
            status: 200,
            message: result[0],
            roles: result[0].roles = 1 ? 'admin' : 'editor'
        })
    })
}

module.exports = {
    wxGetOpenId,
    wxLogin,
    editNickname,
    editUserHeaders,
    userVisitCount,
    visitCount,
    adminLogin,
    adminGetUserInfo,
    checkBalanceZero,
    addBalance,
    signIn,
    getContinuousSignInDays
}  
