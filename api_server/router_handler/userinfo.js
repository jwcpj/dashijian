// 导入数据库模块
const { result } = require('@hapi/joi/lib/base')
const db = require('../db/index')
exports.getUserInfo = (req,res)=>{
 const sqlstr = `select id, username, nickname, email, user_pic from ev_users where id=?`
 db.query(sqlstr,req.user.id,(err,results)=>{
    if(err){
        return res.cc(err)
    }
    if(results.length !== 1){
        return res.cc('获取用户信息失败!')
    }
    res.send({
        status: 0,
        data: results[0],
        message: '获取用户信息成功!'
    })
 })
}