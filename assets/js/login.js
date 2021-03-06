$(function(){
    //点击去注册账号的链接
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击去登录的链接
    $('#link_login').on('click',function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })
    // 从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义pwd校验规则
        pwd: [ /^[\S]{6,12}$/,'密码必须6到12位,且不能出现空格'], 
        // 校验两次密码是否一致
        repwd: function(value){
        //   通过形参拿到确认密码框中的内容
        var pwd = $('.reg-box [name=password]').val()
        //console.log(pwd);
        if(pwd !== value){
            return "两次密码不一致!"
        }
        }
    })
    // 监听注册表单的提交事件
    //console.log($('#form_reg'));
    $('#form_reg').on('submit',function(e){
        e.preventDefault()
        var data = {username: $('#form_reg [name=username]').val(),password: $('#form_reg [name=password]').val()}
        $.post('/api/reguser',data,function(res){
        if(res.status !== 0){
            return layer.msg(res.message);
        }
        layer.msg('注册成功!');
        $('#link_login').click()
    })
    })
    // 监听登陆表单的提交事件
    $('#form_login').on('submit',function(e){
      e.preventDefault()
      $.ajax({
        url: '/api/login',
        method: 'POST',
        data: $(this).serialize(),
        success: function(res){
            if(res.status !== 0){
                return layer.msg('登陆失败!')
            }
            layer.msg('登陆成功!')
            localStorage.setItem('token',res.token)
            //console.log(res.token);
            location.href = '/index.html'
        }
      })
    })
})