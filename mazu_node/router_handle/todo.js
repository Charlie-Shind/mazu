const db = require('../db/index')
const jwt = require("jsonwebtoken")
const jwtSecretKey = `abc81030839`

// 1. 获取当前用户待办列表（带token验证）
const getTodoList = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.send({ status: 401, message: "未登录" });

    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        console.log(decoded.userId);

        const sql = `select id, user_id, content, status, create_time from todo_list where user_id = ?  order by status desc`;
        db.query(sql, [decoded.userId], (err, result) => {
            if (err) return res.send({ status: 500, message: '查询失败: ' + err });
            res.send({ status: 200, data: result });
        })
    } catch (err) {
        res.send({ status: 401, message: "无效令牌" });
    }
}

// 2. 新增待办
const addTodo = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.send({ status: 401, message: "未登录" });

    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        const { content, id } = req.body;
        console.log(id);

        if (!content) return res.send({ status: 400, message: '内容不能为空' });

        const sql = `insert into todo_list (id, content) values(?, ?)`;
        db.query(sql, [id, content], (err, result) => {
            if (err) return res.send({ status: 500, message: '新增失败: ' + err });
            res.send({ status: 200, message: '新增成功', todoId: result.insertId });
        })
    } catch (err) {
        res.send({ status: 401, message: "无效令牌" });
    }
}

// 3. 切换待办状态（未完成→已完成）
const updateTodoStatus = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.send({ status: 401, message: "未登录" });

    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        const { id } = req.params;

        // 仅允许切换自己的待办为已完成
        const sql = `update todo_list set status = 1 where id = ? and user_id = ?`;
        db.query(sql, [id, decoded.userId], (err, result) => {
            if (err) return res.send({ status: 500, message: '更新失败: ' + err });
            if (result.affectedRows === 0) return res.send({ status: 404, message: '待办不存在' });
            res.send({ status: 200, message: '标记为已完成' });
        })
    } catch (err) {
        res.send({ status: 401, message: "无效令牌" });
    }
}

// 4. 删除待办
const deleteTodo = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.send({ status: 401, message: "未登录" });

    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        const { id } = req.params;

        const sql = `delete from todo_list where id = ? and user_id = ?`;
        db.query(sql, [id, decoded.id], (err, result) => {
            if (err) return res.send({ status: 500, message: '删除失败: ' + err });
            if (result.affectedRows === 0) return res.send({ status: 404, message: '待办不存在' });
            res.send({ status: 200, message: '删除成功' });
        })
    } catch (err) {
        res.send({ status: 401, message: "无效令牌" });
    }
}

module.exports = {
    getTodoList,
    addTodo,
    updateTodoStatus,
    deleteTodo
}