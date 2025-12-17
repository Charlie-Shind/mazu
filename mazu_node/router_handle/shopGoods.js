const db = require('../db/index')
const multer = require("multer")
const crypto = require("crypto")
const path = require('path')
const fs = require('fs') // 用于删除图片文件
const baseUrl = require("../baseUrl")

// 多图上传存储配置（存至 public/shop 目录）
const shopStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/shop');
    },
    filename: function (req, file, cb) {
        const randomString = crypto.randomBytes(8).toString('hex');
        const extension = path.extname(file.originalname);
        const uniqueFileName = `shop-img-${Date.now()}-${randomString}${extension}`;
        cb(null, uniqueFileName);
    },
});
const shopUpload = multer({ storage: shopStorage });

// 1. 多图上传接口（支持多张图片，返回URL数组）
const uploadShopImages = (req, res) => {
    shopUpload.array('imgs', 5)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                status: 400,
                message: '图片上传出错：' + err.message
            });
        } else if (err) {
            return res.status(500).json({
                status: 500,
                message: '服务器错误：' + err.message
            });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                status: 400,
                message: '未上传图片'
            });
        }

        const imageUrls = req.files.map(file => {
            return `http://${baseUrl}/shop/${file.filename}`;
        });

        res.send({
            status: 200,
            message: "多图上传成功",
            imageUrls: imageUrls
        })
    })
}

// 2. 新增商品接口（字段完全匹配 shop_goods 表）
const addShop = (req, res) => {
    const { shopname, price, grid, imageUrls, shopinfo, status } = req.body;
    console.log(req.body);

    // 校验必填字段
    if (!shopname || !price || !grid) {
        return res.send({
            status: 400,
            message: '商品名、价格、分类、图片不能为空'
        });
    }
    console.log("1", imageUrls);

    // 图片数组转字符串（逗号分隔）
    const imageUrlStr = imageUrls
    console.log("1", imageUrlStr);
    // SQL 插入（字段与表完全对应：id自增、shopname、price、grid、imageUrl、shopinfo、status）
    const sql = `insert into shop_goods (shopname, price, grid, imageUrl, shopinfo, status) 
               values(?, ?, ?, ?, ?, ?)`;

    const values = [
        shopname.trim(),
        price,
        grid.trim(),
        imageUrlStr,
        shopinfo || '暂无介绍', // 商品描述可选，默认“暂无介绍”
        status || '1' // 状态可选，默认“1-上架”
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '新增商品失败：' + err.message
            });
        }
        res.send({
            status: 200,
            message: '新增商品成功',
            goodsId: result.insertId
        })
    })
}

// 3. 修改商品接口（补充：支持更新所有字段+图片替换）
const updateShop = (req, res) => {
    const { id, shopname, price, grid, imageUrls, shopinfo, status, type } = req.body;
    console.log(req.body);

    // 校验必填字段
    if (!id || !shopname || !price || !grid) {
        return res.send({
            status: 400,
            message: '商品ID、名称、价格、分类、图片不能为空'
        });
    }

    // 步骤1：先查询原有商品信息（用于后续删除旧图片）
    const checkSql = `select imageUrl from shop_goods where id = ?`;
    db.query(checkSql, [id], (checkErr, checkResult) => {
        if (checkErr) {
            return res.send({
                status: 500,
                message: '查询商品失败：' + checkErr.message
            });
        }
        if (checkResult.length === 0) {
            return res.send({
                status: 404,
                message: '商品不存在'
            });
        }

        // 步骤2：图片数组转字符串，准备更新
        const imageUrlStr = imageUrls

        // 步骤3：执行更新SQL
        const updateSql = `update shop_goods set shopname = ?, price = ?, grid = ?, imageUrl = ?, shopinfo = ?, status = ?  ,type=? where id = ?`;
        const values = [
            shopname.trim(),
            price,
            grid.trim(),
            imageUrlStr,
            shopinfo || '暂无介绍',
            status || '1',
            type,
            id
        ];

        db.query(updateSql, values, (updateErr, updateResult) => {
            if (updateErr) {
                return res.send({
                    status: 500,
                    message: '修改商品失败：' + updateErr.message
                });
            }

            // 步骤4：删除旧图片文件（可选，避免服务器存储冗余）
            const oldImageUrls = checkResult[0].imageUrl ? checkResult[0].imageUrl.split(',') : [];
            oldImageUrls.forEach(oldUrl => {
                // 从URL中提取文件名，拼接本地路径
                const fileName = oldUrl.split('/').pop();
                const localPath = path.join(__dirname, '../public/shop/', fileName);
                // 存在则删除
                if (fs.existsSync(localPath)) {
                    fs.unlink(localPath, (err) => {
                        if (err) console.log('删除旧图片失败：', localPath, err);
                    });
                }
            });

            res.send({
                status: 200,
                message: '修改商品成功'
            });
        });
    });
}

// 4. 删除商品接口（按ID删除，优化：同时删除图片文件）
const deleteShop = (req, res) => {
    const { id } = req.params;

    console.log(id);


    if (!id || isNaN(id)) {
        return res.send({
            status: 400,
            message: '无效的商品ID'
        });
    }

    // 步骤1：查询商品的图片URL，用于删除文件
    const checkSql = `select imageUrl from shop_goods where id = ?`;
    db.query(checkSql, [id], (err, checkResult) => {
        if (err) {
            return res.send({
                status: 500,
                message: '查询商品失败：' + err.message
            });
        }
        if (checkResult.length === 0) {
            return res.send({
                status: 404,
                message: '商品不存在'
            });
        }

        // 步骤2：执行删除商品SQL
        const deleteSql = `delete from shop_goods where id = ?`;
        db.query(deleteSql, [id], (deleteErr, deleteResult) => {
            if (deleteErr) {
                return res.send({
                    status: 500,
                    message: '删除商品失败：' + deleteErr.message
                });
            }

            // 步骤3：删除商品对应的图片文件
            const imageUrls = checkResult[0].imageUrl ? checkResult[0].imageUrl.split(',') : [];
            imageUrls.forEach(url => {
                const fileName = url.split('/').pop();
                const localPath = path.join(__dirname, '../public/shop/', fileName);
                if (fs.existsSync(localPath)) {
                    fs.unlink(localPath, (err) => {
                        if (err) console.log('删除商品图片失败：', localPath, err);
                    });
                }
            });

            res.send({
                status: 200,
                message: '删除商品成功'
            });
        });
    });
}

// 5. 商品列表接口（优化：支持分页+搜索）
const getShopList = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * pageSize;

    // 构建SQL：带搜索条件的分页查询
    let sql = `select * from shop_goods`;
    let countSql = `select count(*) as total from shop_goods  `; // 统计总条数
    const params = [];

    // 搜索条件：模糊匹配商品名称
    if (search) {
        sql += ` where shopname like ?`;
        countSql += ` where shopname like ?`;
        params.push(`%${search}%`); // 模糊查询占位符
    }

    // 分页条件
    sql += ` order by type desc`;
    sql += ` limit ?, ?`;
    params.push(offset, pageSize);

    // 步骤1：查询商品列表
    db.query(sql, params, (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库查询出错: ' + err.message
            });
        }

        // 步骤2：查询总条数（用于分页）
        db.query(countSql, search ? [`%${search}%`] : [], (countErr, countResult) => {
            if (countErr) {
                return res.send({
                    status: 500,
                    message: '统计商品总数失败: ' + countErr.message
                });
            }

            const totalCount = countResult[0].total;
            // 图片字符串转数组，status 保持原格式
            const formatResult = result.map(item => {
                return {
                    ...item,
                    imageUrls: item.imageUrl ? item.imageUrl.split(',') : []
                };
            });

            res.send({
                status: 200,
                data: formatResult,
                totalCount: totalCount, // 总条数（前端分页用）
                currentPage: page, // 当前页码
                pageSize: pageSize // 每页条数
            });
        });
    });
}

// 6. 获取商品分类种类
const getShopGrid = (req, res) => {
    const sql = `select distinct grid from shop_goods`;
    db.query(sql, (err, result) => {
        if (err) {
            return res.send({
                status: 500,
                message: '数据库查询出错: ' + err.message
            });
        }
        res.send({
            status: 200,
            data: result
        })
    })
}

// 7. 单独删除图片接口（补充：前端删除单张图片时调用）
const deleteImage = (req, res) => {
    const { imageUrl } = req.body;
    if (!imageUrl) {
        return res.send({
            status: 400,
            message: '图片URL不能为空'
        });
    }

    // 提取文件名，删除本地文件
    const fileName = imageUrl.split('/').pop();
    const localPath = path.join(__dirname, '../public/shop/', fileName);

    if (fs.existsSync(localPath)) {
        fs.unlink(localPath, (err) => {
            if (err) {
                return res.send({
                    status: 500,
                    message: '删除图片失败：' + err.message
                });
            }
            res.send({
                status: 200,
                message: '图片删除成功'
            });
        });
    } else {
        res.send({
            status: 404,
            message: '图片不存在'
        });
    }
}
// 订单详情查询（关联商品+地址，语法100%正确）
const getOrderDetail = (req, res) => {
    const { id } = req.params; // 接收路由参数（订单业务编号）
    console.log('接收的订单号：', id);

    // SQL查询语句（关联三张表，条件匹配订单业务编号）
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
  `;

    // 正确的 db.query() 写法：sql语句 → 参数数组 → 回调函数
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('查询错误：', err.message);
            return res.json({
                code: 500,
                message: '查询订单详情失败',
                err: err.message
            });
        }

        if (result.length === 0) {
            return res.json({
                code: 404,
                message: '订单不存在'
            });
        }

        res.json({
            code: 200,
            data: result[0]
        });
    });
};

// 一键导出
// 订单列表导出接口（修复中文文件名响应头错误）
const exportOrderList = (req, res) => {
    try {
        // 关键修复：用 encodeURIComponent 编码中文文件名，避免特殊字符错误
        const fileName = encodeURIComponent('订单列表'); // 中文转 ASCII 编码
        // 设置响应头（简化格式，兼容所有浏览器）
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=${fileName}.xlsx` // 仅保留编码后的文件名
        );

        // 以下 SQL 查询、数据处理、Excel 生成逻辑完全不变！
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
            order by o.create_time desc
        `;

        db.query(sql, (err, result) => {
            if (err) {
                console.error('查询订单数据错误：', err.message);
                return res.json({
                    code: 500,
                    message: '导出订单列表失败',
                    err: err.message
                });
            }

            if (result.length === 0) {
                const ExcelJS = require('exceljs');
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('订单列表');
                worksheet.columns = [
                    { header: '商品ID', key: 'id', width: 10 },
                    { header: '商品名称', key: 'shopname', width: 30 },
                    { header: '订单号', key: 'order_id', width: 30 },
                    { header: '购买人', key: 'name', width: 10 },
                    { header: '手机号', key: 'mobile', width: 15 }
                ];
                workbook.xlsx.write(res)
                    .then(() => res.end())
                    .catch(writeErr => {
                        console.error('写入空Excel错误：', writeErr.message);
                        res.json({ code: 500, message: '导出失败：无订单数据' });
                    });
                return;
            }

            const ExcelJS = require('exceljs');
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('订单列表', {
                properties: { tabColor: { argb: 'FF4080' } }
            });

            worksheet.columns = [
                { header: '商品ID', key: 'id', width: 10 },
                { header: '商品名称', key: 'shopname', width: 30 },
                { header: '商品价格', key: 'price', width: 12 },
                { header: '商品分类', key: 'grid', width: 15 },
                { header: '商品图片URL', key: 'imageUrl', width: 80 },
                { header: '商品介绍', key: 'shopInfo', width: 40 },
                { header: '支付金额', key: 'payment', width: 12 },
                { header: '订单号', key: 'order_id', width: 30 },
                { header: '支付类型', key: 'payment_type', width: 15 },
                { header: '创建时间', key: 'create_time', width: 25 },
                { header: '支付时间', key: 'pay_time', width: 25 },
                { header: '订单备注', key: 'note', width: 30 },
                { header: '省份', key: 'province_id', width: 15 },
                { header: '城市', key: 'city_id', width: 15 },
                { header: '区县', key: 'district_id', width: 15 },
                { header: '详细地址', key: 'remark', width: 30 },
                { header: '购买人', key: 'name', width: 10 },
                { header: '手机号', key: 'mobile', width: 15 }
            ];

            const formattedData = result.map(item => {
                let imageUrls = '暂无';
                if (item.imageUrl) {
                    try {
                        imageUrls = JSON.parse(item.imageUrl).join(', ');
                    } catch (parseErr) {
                        imageUrls = item.imageUrl;
                    }
                }

                const formatTime = (timeStr) => {
                    return timeStr ? new Date(timeStr).toLocaleString() : '暂无';
                };

                const formatPaymentType = (type) => {
                    const typeMap = { 1: '微信支付', 2: '支付宝支付' };
                    return typeMap[type] || '未知支付方式';
                };

                return {
                    id: item.id || '',
                    shopname: item.shopname || '暂无',
                    price: item.price || '0.00',
                    grid: item.grid || '暂无',
                    imageUrl: imageUrls,
                    shopInfo: item.shopInfo || '暂无介绍',
                    payment: item.payment || 0,
                    order_id: item.order_id || '暂无',
                    payment_type: formatPaymentType(item.payment_type),
                    create_time: formatTime(item.create_time),
                    pay_time: formatTime(item.pay_time),
                    note: item.note || '无备注',
                    province_id: item.province_id || '暂无',
                    city_id: item.city_id || '暂无',
                    district_id: item.district_id || '暂无',
                    remark: item.remark || '暂无',
                    name: item.name || '暂无',
                    mobile: item.mobile || '暂无'
                };
            });

            worksheet.addRows(formattedData);

            worksheet.getRow(1).eachCell(cell => {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F3' } };
                cell.font = { bold: true, color: { argb: 'FF3366' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });

            workbook.xlsx.write(res)
                .then(() => res.end())
                .catch(writeErr => {
                    console.error('写入Excel错误：', writeErr.message);
                    res.json({
                        code: 500,
                        message: '导出订单列表失败',
                        err: writeErr.message
                    });
                });
        });

    } catch (globalErr) {
        console.error('导出接口全局错误：', globalErr.message);
        res.json({
            code: 500,
            message: '导出订单列表失败',
            err: globalErr.message
        });
    }
};


module.exports = {
    getShopList,
    getShopGrid,
    uploadShopImages,
    addShop,
    updateShop,
    deleteShop,
    deleteImage,
    getOrderDetail, // 获取订单详情
    exportOrderList
}