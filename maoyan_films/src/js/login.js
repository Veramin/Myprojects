require('../less/normalized.less');
require('../less/login-register.less');
require('../less/login.less');
require('../less/mask.less');
var Bmob = require('../js/Bmob-1.6.5.min.js');




 // 授权
 Bmob.initialize("6d6177b31e704b50d09aa56bf53a1358", "089cd1fbb5239d622e549c8f9f2c51f6");

 $('.login-btn').click(() => {
    
    // 登录
    Bmob.User.login($('#username').val(),$("#password").val()).then(res => {
        console.log(res);
        
        $('.login-btn').text("登录中...");
        window.location.href = "../../index.html";
      }).catch(err => {
        $('.tips-mask').addClass('show-mask');
        $('.mask-box button').click(() => {
            $('.tips-mask').removeClass('show-mask');
        });
        $('.register-btn').text("登录");
        return;
     });

     Bmob.User.updateStorage('$("#username").val()').then(res => {
      console.log(res)
    }).catch(err => {
     console.log(err)
   });
 });
 