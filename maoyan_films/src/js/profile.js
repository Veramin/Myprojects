require('../less/normalized.less');
require('../less/common.less');
require('../less/profile.less');
import {tabChange,isOnline,loadDatas} from './tools';

var Bmob = require('../js/Bmob-1.6.5.min.js');
 // 授权
 Bmob.initialize("6d6177b31e704b50d09aa56bf53a1358", "089cd1fbb5239d622e549c8f9f2c51f6");
$(function(){
    let menuList = $('.tab-menu li'),
        menuItems = $('.content-item');
    // 判断登录状态
    isOnline();
    // tab菜单切换
    tabChange(menuList,menuItems);
    //获取用户当前信息
    let current = Bmob.User.current();
    console.log(current);
    // 获取选票结果
    const query = Bmob.Query('ticket');
    console.log(query);
    let userId = "";
    //下面参数为Pointer字段名称， 可以一次查询多个表
    query.include("username",current.username);
    query.find().then(res => {

        $('.profile-content').html(`
            ${(function(){
                let seatStr = '';
                res.forEach((user) => {
                    if(user.username == current.username){
                        seatStr +=  `
                    <div class="profile-box">
                    <div class="profile-header">
                    <span class="profile-date">${new Date(user.createdAt).toLocaleDateString()}</span>
                    <span class="profile-id">猫眼订单号:${user.objectId}</span>
                        <span class="del-profile"></span>
                    </div>
                    <div class="profile-body">
                    <div class="poster">
                        ${(function(){
                            let t ='';
                            $.ajax({
                                url: "../json/films.json",
                                // 关闭异步请求
                                async:false,
                                success: function (r) {
                                    r.forEach( function(film) {
                                        if(user.filmId == film.id){
                                            t = `<img src="${film.img}">`;
                                        } 
                                    });
                                    console.log(t)
                                }
                            });
                            return t;

                        })()}
                    </div>
                    <div class="profile-con">
                        <div class="movie-name">${user.filmname}</div>
                        <div class="cinema-name">${user.cinemaname}</div>
                        <div class="hall-ticket">
                        <span>${user.field}</span>
                            ${(function(){
                                let seatStr =  ``;
                                user.seatArr.forEach((seat) => {
                                    seatStr += `<span>${seat[0]}排${seat[1]}座</span>`
                                });
                                return seatStr;
                            })()}
                            
                        </div>
                            ${(function(){
                                let fieldStr = ``;
                                loadDatas('../json/screen-content.json',(respose) => {
                                    respose.forEach((cinema) => {
                                        cinema.field.forEach(field => {
                                            if(user.fieldId == field.id){
                                                fieldStr = `<div class="show-time">${new Date(user.createdAt).toLocaleDateString()} ${field.time}</div>`
                                            }
                                        });
                                    });
                                });
                                return fieldStr;
                            })()}
                        
                    </div>
                    <div class="profile-price">￥${user.totalprice}</div>
                    <div class="profile-status">
                        待支付
                    </div>
                    <div class="actions">
                        <div>
                            <a href="/order/detail/3518745632" class="pay-btn">付款</a>
                        <a href="/order/detail/3518745632" class="profile-detail">查看详情</a>
                        </div>
                    </div>
                    </div>
                </div>
                    `;
                        
                        
                    }
                });
                
                return seatStr;
            })()}`);

        
        // console.log(res);
        
        
        
    }).catch(err => {
        console.log(err)
    })
})


