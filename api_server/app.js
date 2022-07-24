// 导入express
const express = require('express')
// 创建服务器实例
const app = express()
// 导入并配置cors中间件
const cors = require('cors')
// 将cors注册为全局中间件、
// 响应数据的中间件
app.use(function(req,res,next){
  // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
 res.cc = function (err, status = 1) {
 res.send({
   // 状态
   status,
   // 状态描述，判断 err 是 错误对象 还是 字符串
   message: err instanceof Error ? err.message : err,
 })
}
next()
})
app.use(cors())
// 配置解析表单数据的中间件，这个中间件只能解析application/x-www-form-urlencode格式的表单数据
app.use(express.urlencoded({extended: false}))
// 导入配置文件
const config = require('./config')
// 解析 token 的中间件
const expressJWT = require('express-jwt')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))
// 响应数据的中间件
app.use(function (req, res, next) {
  // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
  res.cc = function (err, status = 1) {
    res.send({
      // 状态
      status,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})
const joi = require('joi')

// 错误中间件
app.use(function (err, req, res, next) {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 未知错误
  res.cc(err)
})
// 导入并使用用户路由模块
const userRouter = require('./router/use')
app.use('/api',userRouter)
// 导入并使用用户个人信息路由
const userinfoRouter = require('./router/userinfo')
app.use('/my',userinfoRouter)
// 启动服务器
app.listen(3007,function(){
    console.log('api server running at http://127.0.0.1:3007')
})