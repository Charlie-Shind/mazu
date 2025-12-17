const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// 多图上传存储配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/community/post';
        ensureDir(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const randomStr = crypto.randomBytes(8).toString('hex');
        const ext = path.extname(file.originalname);
        const fileName = `${file.fieldname}-${Date.now()}-${randomStr}${ext}`;
        cb(null, fileName);
    },
});

// 图片过滤（支持多图）
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('仅支持 JPG、PNG、GIF、WebP 格式图片'), false);
    }
};

// 单图上传中间件
const uploadSingle = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 单图5MB限制
}).single('img');

// 多图上传中间件
const uploadMultiple = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 单图5MB
        files: 9, // 最多上传9张图
    },
}).array('images', 9);

// 封装上传逻辑（单图）
const handleSingleUpload = (req, res, next) => {
    uploadSingle(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.send({ status: 400, message: '文件上传出错：' + err.message });
        } else if (err) {
            return res.send({ status: 400, message: err.message });
        }
        next();
    });
};

// 封装上传逻辑（多图）
const handleMultipleUpload = (req, res, next) => {
    uploadMultiple(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.send({ status: 400, message: '文件上传出错：' + err.message });
        } else if (err) {
            return res.send({ status: 400, message: err.message });
        }
        next();
    });
};

// 工具函数：从URL提取文件名
const getFileNameFromUrl = (imageUrl) => {
    if (!imageUrl) return '';
    return imageUrl.split('/').pop();
};

// 工具函数：删除单个文件
const deleteFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

// 工具函数：批量删除文件
const deleteFiles = (filePaths) => {
    filePaths.forEach((path) => {
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    });
};

module.exports = {
    handleSingleUpload,
    handleMultipleUpload,
    getFileNameFromUrl,
    deleteFile,
    deleteFiles,
};