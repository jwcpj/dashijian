// 导入数据库模块
const db = require('../db/index')
// 导入bcryptjs模块
const bcrypt = require('bcryptjs')
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')
// 注册用户处理函数
exports.regUser = (req,res)=>{
    //接受表单数据
    const userinfo = req.body
    // 判断用户名是否合法
    if(!userinfo.username || !userinfo.password) {
        return res.cc('用户名或密码不能为空！')
    }
    // 定义查询sql语句
    const sesql = `select * from ev_users where username=?`
    db.query(sesql,[userinfo.username],function(err,results){
        if(err){
            return res.cc(err)
        }
        if(results.length > 0){
            return res.cc('用户名已被占用！')
        }
    // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
     userinfo.password = bcrypt.hashSync(userinfo.password, 10)
     // 定义插入sql语句
     const insql = 'insert into ev_users set ?'
     db.query(insql,{username: userinfo.username,password: userinfo.password},function(err,results){
         // 执行 SQL 语句失败
         if(err){
             return res.cc(err)
         }
         // SQL 语句执行成功，但影响行数不为 1
         else if(results.affectedRows !== 1){
             return res.cc('注册失败！')
         }
         //注册成功
        else res.send({status: 0,message: '注册成功'})
     })
    })    
}
// 登陆的处理函数
exports.login = (req,res) =>{
    const userinfo = req.body
    const sql = `select * from ev_users where username=?`
    db.query(sql,[userinfo.username],function(err,results){
        //执行sql语句错误
        if(err){
            return res.cc(err)
        }
        // 执行sql语句成功，但查询到的数据条数不等于一条
        if(results.length !== 1){
            return res.cc('登陆失败')
        }
        // 拿着用户输入的密码,和数据库中存储的密码进行对比
       const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)

       // 如果对比的结果等于 false, 则证明用户输入的密码错误
    if (!compareResult) {
     return res.cc('登录失败！')
}
// 通过 ES6 的高级语法，快速剔除 密码 和 头像 的值：
// 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
     const user = { ...results[0], password: '', user_pic: '' }
     // 生成 Token 字符串
const tokenStr = jwt.sign(user, config.jwtSecretKey, {
    expiresIn: '10h', // token 有效期为 10 个小时
  })
  res.send({
      status: 0,
      message: '登录成功！',
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: 'Bearer ' + tokenStr,
    })
    })

}