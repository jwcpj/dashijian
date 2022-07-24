const express = require('express')
// 创建路由对象
const router = express.Router()
//导入用户信息路由处理函数
const userinfo_handle = require('../router_handler/userinfo')
// 获取用户的基本信息
router.get('/userinfo',userinfo_handle.getUserInfo)
// 向外共享路由
module.exports = router