const express = require('express')
const cors = require('cors')
const app = express()

// 跨域
app.use(cors())

// 配置默认文件存放
app.use(express.static('public'));

// 解析体
const bodyParser = require('body-parser'); // 引入body-parser模块

app.use(bodyParser.json()); // 解析json数据格式 
app.use(bodyParser.urlencoded({ extended: true }));

// 客户端api
const indexRouter = require('./router/index')
app.use('/index', indexRouter)
const shopRouter = require('./router/shop')
app.use('/shop', shopRouter)
const userRouter = require('./router/user')
app.use('/user', userRouter)
const communityRouter = require('./router/community')
app.use('/community', communityRouter)
const praysRouter = require('./router/prays')
app.use('/prays', praysRouter)
// admin端API

const adminRouter = require('./router/admin')
app.use('/admin', adminRouter)
const todoRouter = require('./router/todo')

app.use('/todo', todoRouter)


app.listen('8889', () => {
    console.log('服务器启动在8889端口');
})