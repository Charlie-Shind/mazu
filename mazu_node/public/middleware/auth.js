const jwt = require("jsonwebtoken");
const jwtSecretKey = `abc81030839`;

/**
 * JWT 权限验证中间件
 * 验证通过：将解码后的用户信息挂载到 req.user，继续执行后续接口逻辑
 * 验证失败：直接返回 401/403 错误响应
 */
const authMiddleware = (req, res, next) => {
    // 1. 从请求头获取 Token（格式：Authorization: Bearer <token>）
    const token = req.headers.authorization?.split(' ')[1];

    // 2. 验证 Token 是否存在
    if (!token) {
        return res.send({
            status: 401,
            message: "暂无权限，请先登录"
        });
    }

    try {
        // 3. 验证 Token 有效性（过期/签名错误会抛出异常）
        const decoded = jwt.verify(token, jwtSecretKey);

        // 4. Token 验证通过：将用户信息挂载到 req 对象，供后续接口使用
        req.user = decoded; // decoded 包含 Token 中的用户信息（如 user_id、role 等）

        // 5. 继续执行后续接口逻辑
        next();
    } catch (err) {
        // 6. Token 验证失败（过期/无效）
        return res.send({
            status: 403,
            message: "无效的令牌或令牌已过期，请重新登录"
        });
    }
};

module.exports = authMiddleware;