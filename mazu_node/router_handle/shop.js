const db = require('../db/index')
const jwt = require("jsonwebtoken")
const jwtSecretKey = `abc81030839`
// 获取商品列表数据
const getShopList = (req, res) => {
    const sql = `select * from shop_goods`
    db.query(sql,(err, result) => {
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

// 获取商品分类种类
const getShopGrid = (req, res) => {
    const sql = `select distinct grid from shop_goods`
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

// 根据分类筛选商品
const gridSearchShop = (req, res) => {
    if (!req.body.grid) {
        return res.send({
            status: 400,
            message: '请选择分类'
        });
    }
    let sql = `SELECT * FROM shop_goods`;
    let params = [];

    if (req.body.grid !== '全部') {
        sql += ` WHERE grid = ?`;
        params.push(req.body.grid);
    }
    db.query(sql, [req.body.grid], (err, result) => {
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

// 获取商品详情
const getShopDetail = (req, res) => {
    const {
        id
    } = req.body
    const sql = `select * from shop_goods where id = ?`
    db.query(sql, [id], (err, result) => {
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

// 获取用户收货地址
const getAddress = (req, res) => {
    const {
        id
    } = req.body
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
    const sql = `select * from shop_address where user_id = ?`
    db.query(sql, [id], (err, result) => {
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

// 获取用户默认地址
const getDefaultAddress = (req, res) => {
    const {
        id
    } = req.body
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
    const sql = `select * from shop_address where user_id = ? and isDefault = 1`
    db.query(sql, [id], (err, result) => {
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

// 新增收货地址
const addAddress = (req, res) => {
    const {
        user_id,
        province,
        city,
        district,
        remark,
        name,
        mobile,
        isDefault,  // 这里是布尔值 true 或 false
    } = req.body;

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

    // 只有在新增地址被设置为默认时才清空之前的默认地址
    if (isDefault) {
        const updateDefaultAddressSql = `UPDATE shop_address SET isDefault = 0 WHERE user_id = ? AND isDefault = 1`;
        db.query(updateDefaultAddressSql, [user_id], (err, result) => {
            if (err) {
                return res.send({
                    status: 500,
                    message: "数据库查询出错: " + err,
                });
            }

            // 新增地址  
            insertNewAddress();
        });
    } else {
        // 如果不是默认地址，直接新增地址
        insertNewAddress();
    }

    function insertNewAddress() {
        const createTime = new Date().toISOString();
        const insertAddressSql = `INSERT INTO shop_address (user_id, province_id, city_id, district_id, remark, name, mobile, isDefault, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(
            insertAddressSql,
            [
                user_id,
                province,
                city,
                district,
                remark,
                name,
                mobile,
                isDefault ? 1 : 0,  // 将布尔值转换为整数（1 或 0）
                createTime,
                createTime,
            ],
            (err, result) => {
                if (err) {
                    return res.send({
                        status: 500,
                        message: "数据库查询出错: " + err,
                    });
                }
                res.send({
                    status: 200,
                    message: `添加成功`,
                });
            }
        );
    }
};

// 修改收货地址
const editAddress = (req, res) => {
    const {
        id,
        province,
        city,
        district,
        remark,
        name,
        mobile,
        isDefault,
        user_id
    } = req.body;

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

    // 只有在修改的地址被设置为默认时才清空之前的默认地址  
    if (isDefault) {
        const updateDefaultAddressSql = `UPDATE shop_address SET isDefault = 0 WHERE user_id = ? AND isDefault = 1`;
        db.query(updateDefaultAddressSql, [user_id], (err, result) => {
            if (err) {
                return res.send({
                    status: 500,
                    message: "数据库查询出错: " + err,
                });
            }

            // 修改地址  
            updateAddress();
        });
    } else {
        // 如果不是默认地址, 直接修改地址  
        updateAddress();
    }

    function updateAddress() {
        const updateTime = new Date().toISOString();
        const updateAddressSql = `UPDATE shop_address SET province_id = ?, city_id = ?, district_id = ?, remark = ?, name = ?, mobile = ?, isDefault = ?, update_time = ? WHERE id = ? AND user_id = ?`;
        db.query(
            updateAddressSql,
            [
                province,
                city,
                district,
                remark,
                name,
                mobile,
                isDefault ? 1 : 0,
                updateTime,
                id,
                user_id,
            ],
            (err, result) => {
                if (err) {
                    return res.send({
                        status: 500,
                        message: "数据库查询出错: " + err,
                    });
                }
                if (result.affectedRows > 0) {
                    res.send({
                        status: 200,
                        message: "修改成功",
                    });
                } else {
                    res.send({
                        status: 404,
                        message: "未找到该地址",
                    });
                }
            }
        );
    }
};

// 删除收货地址
const delAddress = (req, res) => {
    const { id, user_id } = req.body;
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
    // 删除地址的 SQL 语句
    const deleteAddressSql = `DELETE FROM shop_address WHERE id = ? AND user_id = ?`;
    db.query(deleteAddressSql, [id, user_id], (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: "数据库查询出错: " + err,
            });
        }

        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                message: "删除成功",
            });
        } else {
            res.send({
                status: 404,
                message: "未找到该地址",
            });
        }
    });
};

// 根据地址id获取收货地址
const getIdAddress = (req, res) => {
    const {
        id
    } = req.body
    const sql = `select * from shop_address where id = ?`
    db.query(sql, [id], (err, result) => {
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

// ================================================================================================
// 创建订单
const createOrder = (req, res) => {
    const {
        user_id,
        address_id,
        payment,
        shop_id,
        note
    } = req.body;
    const createTime = new Date().toISOString();
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
    // 生成订单编号(前四位随机生成四个数字,中间为时间戳,后四位随机生成四个数字)  
    const orderNo = generateOrderNo();

    // 检查数据库是否已存在该订单号  
    const sql = 'SELECT * FROM shop_order WHERE order_id = ?';
    db.query(sql, [orderNo], (err, result) => {
        if (err) {
            return res.status(500).send({
                status: 500,
                message: '数据库查询出错: ' + err
            });
        }

        if (result.length > 0) {
            // 如果已存在该订单号,则重新生成  
            orderNo = generateOrderNo();
        }

        // 插入订单数据  
        const insertSql = 'INSERT INTO shop_order (order_id, user_id, address_id, payment, shop_id, note, create_time, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(insertSql, [orderNo, user_id, address_id, payment, shop_id, note, createTime, '10'], (err, result) => {
            if (err) {
                return res.status(500).send({
                    status: 500,
                    message: '订单创建失败: ' + err
                });
            }

            // 设置定时任务,30 分钟后如果订单还未付款,则自动取消订单  
            setTimeout(() => {
                cancelOrder(orderNo);
            }, 30 * 60 * 1000);
            //   }, 1 * 60 * 1000);  

            res.status(200).send({
                status: 200,
                message: '订单创建成功',
                order_no: orderNo
            });
        });
    });
};

// 取消订单的函数  
function cancelOrder(orderNo) {
    const updateSql = 'UPDATE shop_order SET order_status = 0 WHERE order_id = ? AND order_status = 10';
    db.query(updateSql, [orderNo], (err, result) => {
        if (err) {
            console.error('取消订单失败: ', err);
        } else {
            console.log(`订单 ${orderNo} 已自动取消`);
        }
    });
}

// 生成订单编号的函数  
function generateOrderNo() {
    const prefix = Math.floor(1000 + Math.random() * 9000);
    const timestamp = Date.now().toString().slice(-10);
    const suffix = Math.floor(1000 + Math.random() * 9000);
    return `FZHY${prefix}${timestamp}${suffix}`;
}

// ================================================================================================ 

// 商城支付逻辑
const shopPayMoney = (req, res) => {
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
    // 结构body数据
    const {
        pay_money,
        pay_ment,
        order_id,
        user_id
    } = req.body;

    // 查询用户的账户
    const sqlGetUserBalance = `SELECT balance FROM user WHERE id = ?`;
    db.query(sqlGetUserBalance, [user_id], (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: "数据库查询出错: " + err
            });
        }

        // 确保用户存在
        if (result.length === 0) {
            return res.send({
                status: 404,
                message: "该用户不存在"
            });
        }

        const userBalance = result[0].balance;

        // 检查余额是否足够
        if (userBalance < pay_money) {
            return res.send({
                status: 400,
                message: "余额不足"
            });
        }

        // 查询订单状态
        const sqlGetOrderStatus = `SELECT order_status FROM shop_order WHERE order_id = ?`;
        db.query(sqlGetOrderStatus, [order_id], (err, orderResult) => {
            if (err) {
                return res.send({
                    status: 500,
                    message: "查询订单状态出错: " + err
                });
            }

            // 检查订单是否存在
            if (orderResult.length === 0) {
                return res.send({
                    status: 404,
                    message: "该订单不存在"
                });
            }

            const orderStatus = orderResult[0].order_status;

            // 检查订单是否已支付
            if (orderStatus === 20) {
                return res.send({
                    status: 400,
                    message: "重复支付"
                });
            }

            if (orderStatus === 0) {
                return res.send({
                    status: 400,
                    message: "该订单已取消"
                });
            }

            if(orderStatus === 10){
                // 扣除用户余额
                const newBalance = userBalance - pay_money;
                const sqlUpdateBalance = `UPDATE user SET balance = ? WHERE id = ?`;
                db.query(sqlUpdateBalance, [newBalance, user_id], (err) => {
                    if (err) {
                        return res.send({
                            status: 500,
                            message: "更新余额出错: " + err
                        });
                    }
    
                    // 更新订单信息
                    const sqlUpdateOrder = `UPDATE shop_order SET payment_type = ?, pay_time = NOW(), order_status = ? WHERE order_id = ?`;
                    db.query(sqlUpdateOrder, [pay_ment, 20, order_id], (err) => {
                        if (err) {
                            return res.send({
                                status: 500,
                                message: "更新订单信息出错: " + err
                            });
                        }
    
                        res.send({
                            status: 200,
                            message: "付款成功",
                            new_balance: newBalance
                        });
                    });
                });
            }
            
            else{
                return res.send({
                    status: 400,
                    message: "订单异常，请联系管理员"
                });
            }
        });
    });
};

// 获取订单
const getShopOrder = (req,res)=>{
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
        orderType
    } = req.body
    
    let sql = `  
SELECT   
  shop.*,  
  o.payment,  
  o.order_status,  
  o.id AS order_id,  
  o.order_id AS order_no,  
  o.user_id  
FROM shop_order o  
LEFT JOIN shop_goods shop ON shop.id = o.shop_id  
`;  

if (orderType == 10) {  
  sql += ` WHERE order_status = 10 `;  
} else if (orderType == 20) {  
  sql += ` WHERE order_status = 20 `;  
} else if (orderType == 40) {  
  sql += ` WHERE order_status = 40 `;  
} else if (orderType == 0) {  
  sql += ` WHERE order_status = 0 `;  
}  

sql += ` ORDER BY o.id DESC`; // 添加倒序排序  

db.query(sql, (err, result) => {  
  if (err) {  
    return res.status(500).send({  
      status: 500,  
      message: '数据库查询出错: ' + err  
    });  
  }  
  res.send({  
    status: 200,  
    message: result  
  });  
});
}

// 收藏与删除收藏功能
const collectGoods = (req,res)=>{
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
        user_id,
        goods_id,
        judge
    } = req.body
    
    if(!user_id || !goods_id){
        return res.send({
            status:401,
            message:"参数传递不完整"
        })
    }
    
    if(judge){
        const sqlAdd = `insert into shop_collect (user_id, goods_id, collect_time) values(?, ?, NOW())`
        db.query(sqlAdd, [user_id, goods_id],(err,result)=>{
            if (err) {
                return res.status(500).send({
                    status: 500,
                    message: '数据库查询出错: ' + err
                });
            }
            res.send({
                status: 200,
                message: `商品收藏成功`
            })
        })
    }
    else{
        const sqlDel = `delete from shop_collect where user_id = ? and goods_id = ?`
         db.query(sqlDel, [user_id, goods_id],(err,result)=>{
            if (err) {
                return res.status(500).send({
                    status: 500,
                    message: '数据库查询出错: ' + err
                });
            }
            res.send({
                status: 200,
                message: `取消收藏成功`
            })
        })
    }
}

// 获取此商品是否收藏
const judgeCollect = (req,res) => {
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
        user_id,
        goods_id,
        judge
    } = req.body
    
    const sql = `select * from shop_collect where user_id = ? and goods_id = ?`
    db.query(sql,[user_id, goods_id],(err,result)=>{
        if (err) {
            return res.status(500).send({
                status: 500,
                message: '数据库查询出错: ' + err
            });
        }
        if(result.length > 0){
            res.send({
                status: 200,
                judge: true
            })
        }
        else{
           res.send({
                status: 200,
                judge: false
            })
        }
    })
}

// 删除订单
const deleteShopOrder = (req,res) => {
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
        user_id,
        order_no,
    } = req.body
    const delSql = `delete from shop_order where id = ? and user_id = ? and order_id = ?`
    db.query(delSql, [id, user_id, order_no], (err,result) => {
        if (err) {
            return res.status(500).send({
                status: 500,
                message: '数据库查询出错: ' + err
            });
        }
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                message: "删除成功",
            });
        } else {
            res.send({
                status: 404,
                message: "未找到该订单",
            });
        }
    })
}

// 查看订单
const getOrderInfo = (req,res)=>{
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
    const sql = `
        select
        s.*,
        o.payment,
        o.order_id,
        o.payment_type,
        o.create_time,
        o.pay_time,
        o.note,
        a.province_id,
        a.city_id,
        a.district_id,
        a.remark,
        a.name,
        a.mobile
        from shop_order o
        left join shop_goods s on s.id = o.shop_id
        left join shop_address a on a.id = o.address_id
        where o.id = ?
    `
     db.query(sql, [id], (err,result) => {
        if (err) {
            return res.status(500).send({
                status: 500,
                message: '数据库查询出错: ' + err
            });
        }
          res.send({
                status: 200,
                message: result,
            });
    })
}

// 取消订单/确认订单/确认收货
const editOrder = (req, res)=>{
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
        editCode,
        id,
        order_no
    } = req.body
    const editSql = `update shop_order set order_status = ? where id = ? and order_id = ?`
    db.query(editSql,[ editCode,id,order_no],(err,result)=>{
        if (err) {
            return res.status(500).send({
                status: 500,
                message: '数据库查询出错: ' + err
            });
        }
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                message: '操作成功',
            });
        } else {
            res.send({
                status: 404,
                message: "未找到该订单",
            });
        }
    })
}

// 后台管理系统接口
// ==========================================================================================================================================
// 后台管理系统接口

// 获取订单
const shopOrderAdmin = (req, res) => {  
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
    // 获取页码参数，默认为 1  
    const page = parseInt(req.body.page) || 1;  
    const limit = parseInt(req.body.limit) || 10; // 允许从请求中获取 limit 参数  
    const offset = (page - 1) * limit;  

    // 查询总记录数  
    const countSql = `select count(*) as total from shop_order`;  
    
    db.query(countSql, (err, countResult) => {  
        if (err) {  
            return res.status(500).send({  
                status: 500,  
                message: '数据库查询出错: ' + err  
            });  
        }  

        const total = countResult[0].total; // 获取总记录数  

        // 查询当前页的数据  
        const selectSql = `  
        select * from shop_order   
        order by create_time desc  
        limit ${limit} offset ${offset}  
        `;  

        db.query(selectSql, (err, result) => {  
            if (err) {  
                return res.status(500).send({  
                    status: 500,  
                    message: '数据库查询出错: ' + err  
                });  
            }  
            res.send({  
                status: 200,  
                message: result,  
                total: total, // 返回总记录数  
                page: page,  
                limit: limit,  
            });  
        });  
    });  
}


// 查询订单
const selectOrderId = (req, res) => {  
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
    const orderId = req.body.orderId || ''; // 确保 orderId 至少是一个空字符串  
    const page = parseInt(req.body.page) || 1;  
    const limit = parseInt(req.body.limit) || 10; // 允许从请求中获取 limit 参数  
    const offset = (page - 1) * limit;  

    // 定义 SQL 查询以获取符合条件的订单数量  
    const countSql = `  
        SELECT COUNT(*) as total FROM shop_order   
        WHERE order_id LIKE ?   
    `;  

    // 执行计数查询  
    db.query(countSql, [`%${orderId}%`], (err, countResult) => {  
        if (err) {  
            return res.status(500).send({  
                status: 500,  
                message: '数据库查询出错: ' + err  
            });  
        }  

        const total = countResult[0].total; // 获取总记录数  

        // 执行数据查询  
        const selectSql = `  
            select * from shop_order   
            where order_id like ?   
            order by create_time desc  
            limit ? offset ?  
        `;  

        db.query(selectSql, [`%${orderId}%`, limit, offset], (err, result) => {  
            if (err) {  
                return res.status(500).send({  
                    status: 500,  
                    message: '数据库查询出错: ' + err  
                });  
            }  

            res.send({  
                status: 200,  
                message: result,  
                total: total,   // 返回总记录数  
                page: page,  
                limit: limit,  
            });  
        });  
    });  
}

// 订单详情
const orderInfo = (req, res) => {
    const id = req.body.id
    const selectSql = `
        select
        o.order_id,
        o.payment,
        o.payment_type,
        o.create_time,
        o.pay_time,
        o.order_status,
        o.note,
        a.province_id,
        a.city_id,
        a.district_id,
        a.mobile,
        a.remark,
        u.nickname,
        u.avatarurl,
        s.shopname,
        s.imageUrl
        from shop_order o
        join user u on o.user_id = u.id
        left join shop_address a on o.address_id = a.id
        left join shop_goods s on o.shop_id = s.id
        where o.id = ?
    `
    db.query(selectSql, [id], (err, result) => {
        if (err) {  
            return res.status(500).send({  
                status: 500,  
                message: '数据库查询出错: ' + err  
            });  
        }  
        res.send({  
            status: 200,  
            message:result
        });  
    })
}

module.exports = {
    getShopList,
    getShopGrid,
    gridSearchShop,
    getShopDetail,
    getAddress,
    getDefaultAddress,
    addAddress,
    editAddress,
    delAddress,
    getIdAddress,
    createOrder,
    shopPayMoney,
    getShopOrder,
    collectGoods,
    judgeCollect,
    deleteShopOrder,
    getOrderInfo,
    editOrder,
    shopOrderAdmin,
    selectOrderId,
    orderInfo
}