// 每次调用$.get()或$.post()或$.ajax()的时候
// 会先调用ajaxPrefilter这个函数
// 在这个函数中,可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options){
    
    // 再发起真正的ajax请求之前,统一拼接请求的根路径
    options.url = 'http://127.0.0.1:3007'+options.url
    // 统一为有权限的接口设置请求头{
    if(options.url.indexOf('/my')!== -1){
        options.headers = {
            Authorization: localStorage.getItem('token')||''
        }
        // 全局统一挂载complete回调函数
        options.complete = function(res){
            console.log(res);
            if(res.responseJSON.status === 1 && res.responseJSON.message === 'No authorization token was found'){
             // 清空本地存储的token
             localStorage.removeItem('token')
             // 重新跳转到登录界面
             location.href = '/login.html'
            }
        }
    }

    
})