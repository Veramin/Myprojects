require('../less/normalized.less');
require('../less/common.less');
require('../less/mask.less');
require('../less/order.less'); 
import {isOnline,updateSeat,getUrlParam,loadDatas} from './tools';
var Bmob = require('../js/Bmob-1.6.5.min.js');
 // 授权
 Bmob.initialize("6d6177b31e704b50d09aa56bf53a1358", "089cd1fbb5239d622e549c8f9f2c51f6");

$(function(){
    // 判断登录状态
    isOnline();
    //获取用户当前信息
    let current = Bmob.User.current();
    // 创建一个表
    const query = Bmob.Query('ticket');
    // 单价
    let unitPrice = null;
    
    // 获取电影id
    var filmId = getUrlParam('filmId');
    console.log(filmId);
    // 获取影院id
    var cinemaId = getUrlParam('cinemaId');
    console.log(cinemaId);
    // 获取场次id
    var fieldId = getUrlParam('fieldId');
    console.log(fieldId);
    // 加载电影数据
    loadDatas('../json/films.json',(response) => {
        $('.film-infos').html(`${(function(){
            
            let filmStr = ""; 
            response.forEach(film => {
                if(filmId == film.id ){
                    filmStr = `
                        <img class="film-img fl" src="${film.img}" alt="${film.chineseName}">
                        <section class="fl">
                            <h1 class="film-title">${film.chineseName}</h1>
                            <p class="film-type"><span>类型 ：</span>${film.type}</p>
                            <p class="film-time-duration"><span>时长：</span>${film.timeDuration}</p>
                        </section>
                    `;
                }
            });
            return filmStr;
        })()}`);
    });

    // 加载影院数据
    loadDatas('../json/screen-content.json',(response) => {
        $('.film-introduce').html(`${(function(){
            
            let cinemaStr = "";
            response.forEach(cinema => {
                cinema.field.forEach((field,index) => {
                    if(cinemaId == cinema.id && fieldId == field.id ){
                        cinemaStr = `
                            <p class="cinema"><span>影院 ：</span><span class="cinema-name">${cinema.name}</span></p>
                            <p class="movie-hall"><span>影厅 ：</span><span class="cinema-field">${field.hallNumber}</span>(${cinema.type})</p>
                            <p class="version"><span>版本 ：</span>${field.language}</p>
                            <p class="film-field"><span>场次 : </span>${new Date().toLocaleDateString()}&nbsp;&nbsp;${field.time}</p>
                            <p class="film-price"><span>票价 : ￥</span><span class="unit-price">${field.price}</span>/张</p>
                        `;
                    }
                });
                
            });
            return cinemaStr;
        })()}`);
        // 获取单价
        unitPrice =  $('.unit-price').text();
    });
    // 选票
    // 记录选择的票数
    let number = 0;
    // 坐标集合
    let seatArr = [];
    // 记录是否选择该座位
    let isChecked = false; 
    
    $('.seat-container span').each((index,item) => {
        $(item).click((e) => {
            $('.no-chioce-set').addClass('no-chioce');
            $('.have-chioce').addClass("show-seat-list");
            // 记录当前选中的坐标
            let seat =[];
            if($(item).hasClass('checked')){
                $(e.target).removeClass('checked');
                // 记录坐标
                seat[0] =  $(e.target).parent().data('index');
                seat[1] =  $(e.target).data('index');
                // 记录选择状态
                isChecked = false;
                // 更新票数
                number = number -1;
                
                // 更新选择结果显示
                updateSeat(seatArr,seat,isChecked,number,unitPrice,(n,arr) => {
                    number = n - 1;
                    seatArr = arr;
                });

                // 边界问题
                if(number == 0){
                    number = 0;
                    // 更新选择结果显示
                    $('.no-chioce-set').removeClass('no-chioce');
                    $('.have-chioce').removeClass("show-seat-list");
                    $('.totalprice').text("0");
                    return; 
                }
            }else{
                $(e.target).addClass('checked');
                // 记录坐标
                seat[0] =  $(e.target).parent().data('index');
                seat[1] =  $(e.target).data('index');
                // 记录选择状态
                isChecked = true;
                // 更新票数
                number = number + 1;
                // 更新选择结果显示
                updateSeat(seatArr,seat,isChecked,number,unitPrice,(n,arr) => {
                    number = n - 1;
                    seatArr = arr;
                });
                // 处理边界问题
                if( number > 5){
                    $(e.target).removeClass('checked');
                    isChecked = false;
                    number = 5;
                    // 更新选择结果显示
                    updateSeat(seatArr,seat,isChecked,number,unitPrice,(n,arr) => {
                        number = n - 1;
                        seatArr = arr;
                    });
                    
                    // 显示遮罩提示
                    showMask("一次最多购买5张票");
                    return;
                }
            }
            // 将用户的选票结果存到 
            console.log(seatArr);
            console.log($('.totalprice').text());
        });
    });
    

    function showMask(str){
        $('.tips-mask').addClass('show-mask');
            $('.tips-text').text(str);
            $('.mask-box button').click(() => {
                $('.tips-mask').removeClass('show-mask');
        });
    }
    // 确认选座
   
    $('.sure-choice-btn').click(() => {
        if($('.totalprice').text() == 0){
            // 显示遮罩提示
            showMask("请选择座位！！！");
            return;
        }else if(current == null){
            // 显示遮罩提示
            showMask("请先登录！！！");
            return;
        }else if(!$('.uesername').val()){
            // 显示遮罩提示
            showMask("请先输入手机号！！！");
            return;
        }else if($('.uesername').val() != current.username){
            // 显示遮罩提示
            showMask("请输入正确的手机号！！！");
            return;
        }else{
            
            
            query.set("username",current.username);
            query.set("filmId",filmId);
            query.set("filmname",$('.film-title').text());
            query.set("cinemaId",cinemaId);
            query.set("cinemaname",$('.cinema-name').text());
            query.set("fieldId",fieldId);
            query.set("field",$('.cinema-field').text());
            query.set("unitprice",unitPrice);
            query.set("seatArr",seatArr);
            query.set("iscur",true);
            query.set("ispay",false);
            query.set("totalprice",$('.totalprice').text());
            query.save().then(res => {
            console.log(res);
            window.location.href = `./pay.html?filmId=${filmId}&cinemaId=${cinemaId}&fieldId=${fieldId}`;
            }).catch(err => {
            console.log(err)
            })
            
            //下面参数为Pointer字段名称， 可以一次查询多个表
            // query.include("username",current.username);
            // query.find().then(res => {
            //     console.log(res);

            //     if(res.length != 0 && user.username == current.username)
            //     if(res.length == 0){
            //          // 将用户的选票结果存到bmob
            //          query.set("username",current.username);
            //          query.set("filmId",filmId);
            //          query.set("cinemaId",cinemaId);
            //          query.set("fieldId",fieldId);
            //          query.set("unitprice",unitPrice);
            //          query.set("seatArr",seatArr);
            //          query.set("totalprice",$('.totalprice').text());
            //          query.save().then(res => {
            //          console.log(res)
            //          }).catch(err => {
            //          console.log(err)
            //          })
            //          window.location.href = `./pay.html?filmId=${filmId}&cinemaId=${cinemaId}&fieldId=${fieldId}`;
            //     }else{
            //         res.forEach((user) => {
            //             if(user.username == current.username ){
            //                 showMask("您还有未支付的订单，请先支付！！！");
            //                 return;
            //             }
            //         });
            //     }
                
            // }).catch(err => {
            //     console.log(err)
            // })
            
        }
        
    });
 

    

    
});