// router/todo.js（仅对应你提供的4个接口，无多余路由）
const express = require('express');
const router = express.Router();
const todoHandle = require('../router_handle/todo'); // 你的待办接口逻辑文件

// 1. 获取当前用户待办列表（GET）
router.get('/', todoHandle.getTodoList);

// 2. 新增待办事项（POST）
router.post('/', todoHandle.addTodo);

// 3. 切换待办状态（未完成→已完成）（PUT）
router.put('/:id/status', todoHandle.updateTodoStatus);

// 4. 删除待办事项（DELETE）
router.delete('/:id', todoHandle.deleteTodo);

module.exports = router;