const db = require('../db/index')
const jwt = require("jsonwebtoken")
const jwtSecretKey = `abc81030839`
const multer = require("multer")
const crypto = require("crypto")
const path = require('path')
const fs = require('fs')
const baseUrl = require("../baseUrl")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/index'); // 上传的文件存储在 /index 目录中
    },
    filename: function (req, file, cb) {
        const randomString = crypto.randomBytes(8).toString('hex');
        const extension = path.extname(file.originalname);
        const uniqueFileName = `${file.fieldname}-${Date.now()}-${randomString}${extension}`;
        cb(null, uniqueFileName); // 使用随机字符串来确保文件名的唯一性
    },
});
const upload = multer({ storage: storage });

const getCarousel = (req, res) => {
    const sql = `select * from index_carousel`
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

const getCreativity = (req, res) => {
    const sql = `select * from index_creativity`
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

const getRecommend = (req, res) => {
    const sql = `select * from index_recommend`
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

const getindexGridNews = (req, res) => {
    const sql = `select * from index_grid_news`
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

const getindexNewsItem = (req, res) => {
    const sql = `select * from index_grid_news where id = ?`
    db.query(sql, [req.body.id], (err, result) => {
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

const getindexGridFuCulture = (req, res) => {
    const sql = `select * from index_grid_fuculture`
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

const getindexFuCultureItem = (req, res) => {
    const sql = `select * from index_grid_fuculture where id = ?`
    db.query(sql, [req.body.id], (err, result) => {
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

const getindexGridFaith = (req, res) => {
    const sql = `select * from index_grid_faith`
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

const getindexFaithItem = (req, res) => {
    const sql = `select * from index_grid_faith where id = ?`
    db.query(sql, [req.body.id], (err, result) => {
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

const getindexGridMazuCulture = (req, res) => {
    const sql = `select * from index_grid_mazuculture`
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

const getindexMazuCultureItem = (req, res) => {
    const sql = `select * from index_grid_mazuculture where id = ?`
    db.query(sql, [req.body.id], (err, result) => {
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

const getindexGridPalaceTemple = (req, res) => {
    const sql = `select * from index_grid_placetemple`
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

const getindexPalaceTempleItem = (req, res) => {
    const sql = `select * from index_grid_placetemple where id = ?`
    db.query(sql, [req.body.id], (err, result) => {
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

const getindexGridPublication = (req, res) => {
    const sql = `select * from index_grid_publication`
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

const getindexPublicationItem = (req, res) => {
    const sql = `select * from index_grid_publication where id = ?`
    db.query(sql, [req.body.id], (err, result) => {
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

const getindexGridCultureCreativity = (req, res) => {
    const sql = `select * from index_grid_culturecreativity`
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

const getindexCultureCreativityItem = (req, res) => {
    const sql = `select * from index_grid_culturecreativity where id = ?`
    db.query(sql, [req.body.id], (err, result) => {
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

const getindexGridTourism = (req, res) => {
    const sql = `select * from index_grid_tourism`
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

const getindexTourismItem = (req, res) => {
    const sql = `select * from index_grid_tourism where id = ?`
    db.query(sql, [req.body.id], (err, result) => {
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


// 后台管理系统接口
// ==========================================================================================================================================
// 后台管理系统接口

// 图片上传接口
const indexUploadImage = (req, res) => {
    const {
        imageUrl
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
    upload.single('img')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    status: 400,
                    message: `文件大小超出限制，最大允许 ${multer.limits.fileSize} 字节，上传文件大小为 ${req.file.size} 字节。`
                });
            } else {
                return res.status(400).json({
                    status: 400,
                    message: '文件上传出错：' + err.message
                });
            }
        } else if (err) {
            return res.status(500).json({
                status: 500,
                message: '服务器错误' + err
            });
        }
        // If the upload is successful  
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: '未上传文件'
            });
        }
        // Generate the complete image URL  
        const imageUrl = `http://${baseUrl}/index/${req.file.filename}`;
        return res.send({
            status: 200,
            message: "图片上传成功",
            imageUrl: imageUrl
        })
    })
}

// 删除图片方法
// 删除图片方法
const deleteImage = (req, res) => {
    const { imageUrl, file } = req.body;

    // 1. 校验必填参数是否存在且格式正确
    if (!imageUrl) {
        return res.send({
            status: 400,
            message: '缺少必填参数：imageUrl'
        });
    }
    if (typeof imageUrl !== 'string') {
        return res.send({
            status: 400,
            message: 'imageUrl 必须是字符串类型'
        });
    }
    if (!file) {
        return res.send({
            status: 400,
            message: '缺少必填参数：file（文件夹名称）'
        });
    }
    if (typeof file !== 'string') {
        return res.send({
            status: 400,
            message: 'file 必须是字符串类型（文件夹名称）'
        });
    }

    // 2. 安全解析文件名（避免空字符串或异常URL）
    let filename = imageUrl.split('/').pop();
    // 处理特殊情况：如果 split 后没有得到有效文件名
    if (!filename || filename.trim() === '') {
        return res.send({
            status: 400,
            message: 'imageUrl 格式错误，无法解析文件名'
        });
    }

    // 3. 拼接文件路径（保持原逻辑）
    const folderPath = path.join(__dirname, '../public/', file);
    const filePath = path.join(folderPath, filename);

    // 打印路径用于调试（可选）
    console.log('待删除文件路径：', filePath);

    // 4. 检查文件是否存在并删除
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('文件不存在：', err.message);
            return res.send({
                status: 404,
                message: '图片不存在',
                filePath: filePath // 返回路径方便调试
            });
        }
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('删除文件失败：', err.message);
                return res.send({
                    status: 500,
                    message: '删除图片失败：' + err.message
                });
            }
            return res.send({
                status: 200,
                message: '图片删除成功'
            });
        });
    });
};
// const deleteImage = (req, res) => {
//     // const token = req.headers.authorization?.split(' ')[1];
//     // let decoded;
//     // if (!token) {
//     //     return res.send({
//     //         status: 501,
//     //         message: "暂无权限"
//     //     })
//     // }
//     // if (jwt.verify(token, jwtSecretKey)) {
//     //     decoded = jwt.decode(token);
//     // } else {
//     //     return res.send({
//     //         status: 501,
//     //         message: "无效的令牌"
//     //     })
//     // }
//     // const { imageUrl,file } = req.body;
//     // const filename = imageUrl.split('/').pop();
//     // const filePath = path.join(__dirname, '../public/prays', filename);

//     const { imageUrl, file } = req.body;
//     const filename = imageUrl.split('/').pop();
//     const folderPath = path.join(__dirname, '../public/', file); // 先拼接文件夹路径
//     const filePath = path.join(folderPath, filename); // 再拼接文件名到文件夹路径

//     fs.access(filePath, fs.constants.F_OK, (err) => {
//         if (err) {
//             return res.send({
//                 status: 404,
//                 message: '图片不存在' + err,
//                 data: filePath
//             });
//         }
//         fs.unlink(filePath, (err) => {
//             if (err) {
//                 return res.send({
//                     status: 500,
//                     message: '删除图片失败：' + err.message
//                 });
//             }
//             return res.send({
//                 status: 200,
//                 message: '图片删除成功'
//             });
//         });
//     });
// };

// 修改内容
const editIndexContent = (req, res) => {
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
        title,
        content,
        time,
        grid,
        imageUrl,
        id
    } = req.body
    let tableName;
    switch (editCode) {
        case '1':
            tableName = 'index_grid_news';
            break;
        case '2':
            tableName = 'index_grid_fuculture';
            break;
        case '3':
            tableName = 'index_grid_faith';
            break;
        case '4':
            tableName = 'index_grid_mazuculture';
            break;
        case '5':
            tableName = 'index_grid_placetemple';
            break;
        case '6':
            tableName = 'index_grid_publication';
            break;
        case '7':
            tableName = 'index_grid_culturecreativity';
            break;
        case '8':
            tableName = 'index_grid_tourism';
            break;
        default:
            tableName = null;
    }
    if (!tableName) {
        return res.send({
            status: 500,
            message: '无效的编辑代码'
        });
    }
    const editSql = `update ${tableName} set title = ?, content = ?, time = ?, imageUrl = ?, grid = ? where id = ?`;
    db.query(editSql, [title, content, time, imageUrl, grid, id], (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库查询出错: ' + err
            });
        }
        res.send({
            status: 200,
            message: '修改成功'
        })
    })
}

// 新增内容
const insertIndexContent = (req, res) => {
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
        title,
        content,
        time,
        grid,
        imageUrl
    } = req.body;
    let tableName;
    switch (editCode) {
        case '1':
            tableName = 'index_grid_news';
            break;
        case '2':
            tableName = 'index_grid_fuculture';
            break;
        case '3':
            tableName = 'index_grid_faith';
            break;
        case '4':
            tableName = 'index_grid_mazuculture';
            break;
        case '5':
            tableName = 'index_grid_placetemple';
            break;
        case '6':
            tableName = 'index_grid_publication';
            break;
        case '7':
            tableName = 'index_grid_culturecreativity';
            break;
        case '8':
            tableName = 'index_grid_tourism';
            break;
        default:
            tableName = null;
    }
    if (!tableName) {
        return res.send({
            status: 500,
            message: '无效的编辑代码'
        });
    }
    const insertSql = `INSERT INTO ${tableName} (title, content, time, imageUrl, grid) VALUES (?,?,?,?,?)`;
    db.query(insertSql, [title, content, time, imageUrl, grid], (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库插入出错: ' + err
            });
        }
        res.send({
            status: 200,
            message: '插入成功',
            insertedId: result.insertId
        });
    });
};

// 删除内容
const deleteIndexContent = (req, res) => {
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
    const { editCode, ids } = req.body; // 从请求体中获取 editCode 和 ids  
    let tableName;

    // 验证 ids 是否为数组  
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.send({
            status: 400,
            message: '无效的 ID 列表'
        });
    }

    // 根据 editCode 定义表名  
    switch (editCode) {
        case '1':
            tableName = 'index_grid_news';
            break;
        case '2':
            tableName = 'index_grid_fuculture';
            break;
        case '3':
            tableName = 'index_grid_faith';
            break;
        case '4':
            tableName = 'index_grid_mazuculture';
            break;
        case '5':
            tableName = 'index_grid_placetemple';
            break;
        case '6':
            tableName = 'index_grid_publication';
            break;
        case '7':
            tableName = 'index_grid_culturecreativity';
            break;
        case '8':
            tableName = 'index_grid_tourism';
            break;
        default:
            tableName = null; // 无效的 editCode  
    }

    // 如果 tableName 无效，返回错误信息  
    if (!tableName) {
        return res.send({
            status: 500,
            message: '无效的编辑代码'
        });
    }

    // 构造 SQL 删除语句  
    const deleteSql = `DELETE FROM ${tableName} WHERE id IN (?)`;

    // 执行删除操作  
    db.query(deleteSql, [ids], (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库删除出错: ' + err
            });
        }

        // 返回受影响的行数  
        res.send({
            status: 200,
            message: '删除成功',
            affectedRows: result.affectedRows // 返回受影响的行数  
        });
    });
};

// 获取今日订单数量
const getTodayOrderCount = (req, res) => {
    const getSql = `select count(*) as orderCount from shop_order where STR_TO_DATE(create_time, '%Y-%m-%d') = CURDATE()`
    db.query(getSql, (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库获取出错: ' + err
            });
        }

        res.send({
            status: 200,
            message: result,
        });
    })
}

// 获取今日用户访问总量
const getTodayVisitCount = (req, res) => {
    const getSql = `select ifnull(sum(visit_count), 0) as visitCount from visit_count where visit_Date = CURDATE()`
    db.query(getSql, (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库获取出错: ' + err
            });
        }

        res.send({
            status: 200,
            message: result,
        });
    })
}

// 获取今日销售总额
const getTodaySales = (req, res) => {
    const getSql = `select ifnull(sum(payment),0) as sales from shop_order
    where (order_status = 30 or order_status = 40)
    and date(pay_time) = curdate()
    `
    db.query(getSql, (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库获取出错: ' + err
            });
        }

        res.send({
            status: 200,
            message: result,
        });
    })
}

// 获取昨日销售总额
const getSubSales = (req, res) => {
    const getSql = `SELECT ifnull(SUM(payment),0) as subSales
    FROM shop_order
    WHERE (order_status = 30 OR order_status = 40)
    AND DATE(pay_time) = DATE_SUB(CURDATE(), INTERVAL 1 DAY);`
    db.query(getSql, (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库获取出错: ' + err
            });
        }

        res.send({
            status: 200,
            message: result,
        });
    })
}

// 获取本周周一到周天每天的销售额数据，包括无订单的情况
const getThisWeekSales = (req, res) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    // 计算本周一的日期
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() - currentDate.getDay() + 2);
    // 计算本周日的日期
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const startDate = monday.toISOString().split('T')[0];
    const endDate = sunday.toISOString().split('T')[0];

    const getSql = `
        SELECT
            days.saleDay,
            IFNULL(orders.sales, 0) AS sales
        FROM
            -- 生成本周周一到周天的日期标识集合
            (
                SELECT '星期一' AS saleDay, '${startDate}' AS saleDate UNION ALL
                SELECT '星期二', DATE('${startDate}' + INTERVAL 1 DAY) UNION ALL
                SELECT '星期三', DATE('${startDate}' + INTERVAL 2 DAY) UNION ALL
                SELECT '星期四', DATE('${startDate}' + INTERVAL 3 DAY) UNION ALL
                SELECT '星期五', DATE('${startDate}' + INTERVAL 4 DAY) UNION ALL
                SELECT '星期六', DATE('${startDate}' + INTERVAL 5 DAY) UNION ALL
                SELECT '星期日', DATE('${startDate}' + INTERVAL 6 DAY)
            ) days
            -- 左连接订单表
            LEFT JOIN (
                SELECT
                    DATE(pay_time) AS saleDate,
                    SUM(payment) AS sales
                FROM
                    shop_order
                WHERE
                    (order_status = 20 OR order_status = 30 OR order_status = 40)
                    AND DATE(pay_time) BETWEEN '${startDate}' AND '${endDate}'
                GROUP BY
                    DATE(pay_time)
            ) orders ON days.saleDate = orders.saleDate;
    `;
    db.query(getSql, (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库获取出错:' + err
            });
        }
        res.send({
            status: 200,
            message: result
        });
    });
};

const getLastWeekSales = (req, res) => {
    // 获取当前日期
    const currentDate = new Date();
    // 计算当前周周一的日期
    let thisWeekMonday = new Date(currentDate);
    thisWeekMonday.setDate(currentDate.getDate() - currentDate.getDay() + 1); // 修正为周一
    // 计算上一周周一的日期
    const lastWeekMonday = new Date(thisWeekMonday);
    lastWeekMonday.setDate(thisWeekMonday.getDate() - 7);
    // 计算上一周周日的日期
    const lastWeekSunday = new Date(lastWeekMonday);
    lastWeekSunday.setDate(lastWeekMonday.getDate() + 6);

    const startDate = lastWeekMonday.toISOString().split('T')[0];
    const endDate = lastWeekSunday.toISOString().split('T')[0];

    const getSql = `
        SELECT
            days.saleDay,
            IFNULL(orders.sales, 0) AS sales
        FROM
            -- 生成上一周周一到周天的日期标识集合
            (
                SELECT '星期一' AS saleDay, '${startDate}' AS saleDate UNION ALL
                SELECT '星期二', DATE('${startDate}' + INTERVAL 1 DAY) UNION ALL
                SELECT '星期三', DATE('${startDate}' + INTERVAL 2 DAY) UNION ALL
                SELECT '星期四', DATE('${startDate}' + INTERVAL 3 DAY) UNION ALL
                SELECT '星期五', DATE('${startDate}' + INTERVAL 4 DAY) UNION ALL
                SELECT '星期六', DATE('${startDate}' + INTERVAL 5 DAY) UNION ALL
                SELECT '星期日', DATE('${startDate}' + INTERVAL 6 DAY)
            ) days
            -- 左连接订单表
            LEFT JOIN (
                SELECT
                    DATE(pay_time) AS saleDate,
                    SUM(payment) AS sales
                FROM
                    shop_order
                WHERE
                    (order_status = 20 OR order_status = 30 OR order_status = 40)
                    AND DATE(pay_time) BETWEEN '${startDate}' AND '${endDate}'
                GROUP BY
                    DATE(pay_time)
            ) orders ON days.saleDate = orders.saleDate;
    `;
    db.query(getSql, (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库获取出错: ' + err
            });
        }
        res.send({
            status: 200,
            message: result
        });
    });
};

module.exports = {
    getCarousel,
    getCreativity,
    getRecommend,
    getindexGridNews,
    getindexGridFuCulture,
    getindexGridFaith,
    getindexGridMazuCulture,
    getindexGridPalaceTemple,
    getindexGridPublication,
    getindexGridCultureCreativity,
    getindexGridTourism,
    getindexNewsItem,
    getindexFuCultureItem,
    getindexFaithItem,
    getindexMazuCultureItem,
    getindexPalaceTempleItem,
    getindexPublicationItem,
    getindexCultureCreativityItem,
    getindexTourismItem,
    indexUploadImage,
    deleteImage,
    editIndexContent,
    insertIndexContent,
    deleteIndexContent,
    getTodayOrderCount,
    getTodayVisitCount,
    getTodaySales,
    getSubSales,
    getThisWeekSales,
    getLastWeekSales
} 