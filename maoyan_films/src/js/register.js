require('../less/normalized.less');
require('../less/login-register.less');
require('../less/register.less');
require('../less/mask.less');
var Bmob = require('../js/Bmob-1.6.5.min.js');
// import Bmob from "hydrogen-js-sdk";


$(function(){
    // 表单验证
    $('.my-form input').each((index,input) => {
        let isError = false;
        $(input).change((e) => {
            let inputVal = $(e.target).val();
            switch($(e.target).attr("id")){
                case 'username': {
                    if(!(/^1\d{10}$/.test(inputVal))){
                        isError = true;
                        $(e.target).parent().removeClass('username');
                    } 
                }break;
                case 'firpassword': {
                    if(!(/^[\w~!@#$%^&*()-+=:"<>?;',./]{6,10}$/.test(inputVal))){
                        isError = true;
                    }
                }break;
                case 'secpassword': {
                    if((!(/^[\w~!@#$%^&*()-+=:"<>?;',./]{6,10}$/.test(inputVal))) || (inputVal !== $('#firpassword').val())){
                        isError = true;
                    }
                }break;
            }
            if(isError){
                $(e.target).next().removeClass('tips-success').addClass('tips-error');
                $(e.target).parent().addClass('tips');
                isError = !isError;
            }else{
                $(e.target).parent().removeClass(['tips','username']);
                $(e.target).next().addClass('tips-success');
            }
        });
    });

    // 密码强度检测
    $('#firpassword').bind('input propertychange', function(e) {
        $('.pw-strength').each(() => {
            if(/^\d{6,10}$/.test($(e.target).val())){
                // 长度在6~10之间，只能包数字
                $('.pw-strength-l').addClass('strength_L');
            }else if(/^\w{6,10}$/.test($(e.target).val())){
                // 长度在6~10之间，只能包含字母、数字和下划线
                $('.pw-strength-l').removeClass('strength_L').addClass('pre_L');
                $('.pw-strength-m').addClass('strength_M');
            }else if(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,10}$/.test($(e.target).val())){
                // 强密码(必须包含大小写字母和数字的组合，不能使用特殊字符，长度在6-10之间)
                $('.pw-strength-l').removeClass(['strength_L','pre_L']).addClass('pre_LL');
                $('.pw-strength-m').removeClass('strength_M').addClass('pre_M');
                $('.pw-strength-h').addClass('strength_H');
            }

        });
    });


   

    

    // 授权
    Bmob.initialize("6d6177b31e704b50d09aa56bf53a1358", "089cd1fbb5239d622e549c8f9f2c51f6");
    // 注册
    $('.register-btn').click(() => {
        let params = {
            username: $('#username').val(),
            password: $('#secpassword').val()
        }
        Bmob.User.register(params).then(res => {
          console.log(res);
          
          $('.register-btn').text("注册中...");
          if($('.tips-status').hasClass('tips-error')){
                $('.tips-mask').addClass('show-mask');
                $('.mask-box button').click(() => {
                    $('.tips-mask').removeClass('show-mask');
                });
                $('.register-btn').text("同意以下协议并注册");
                return;
          }
          window.location.href = "../../login.html";
        }).catch(err => {
            $('.tips-mask').removeClass('show-mask');
            $('.tips-text').text('该用户已被注册！！！');
        });
        
    });
    
    
});