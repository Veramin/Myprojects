require('../less/normalized.less');
require('../less/common.less');
require('../less/choose-seat.less');
require('../less/mask.less');
require('../less/pay.less');
import {isOnline,getUrlParam,loadDatas} from './tools';
var Bmob = require('../js/Bmob-1.6.5.min.js');
 // 授权
 Bmob.initialize("6d6177b31e704b50d09aa56bf53a1358", "089cd1fbb5239d622e549c8f9f2c51f6");
$(function(){
    // 判断登录状态
    isOnline();
    // 获取电影id
    var filmId = getUrlParam('filmId');
    // 获取影院id
    var cinemaId = getUrlParam('cinemaId');
    // 获取场次id
    var fieldId = getUrlParam('fieldId');
    //获取用户当前信息
    let current = Bmob.User.current();
    // 获取选票结果
    const query = Bmob.Query('ticket');
    let userId = "";
    
     // 加载场次数据
     loadDatas('../json/screen-content.json',(res) => {
        $('.cinemas-field').html(`  
            ${(function(){
            let s = "";
            res.forEach(cinema => {
                cinema.field.forEach(field => {
                    if(cinemaId == cinema.id && fieldId == field.id){
                        s = `
                            <section class="thead">
                                <span class="td">影片</span>
                                <span class="td">时间</span>
                                <span class="td">影院</span>
                                <span class="td">座位</span>
                            </section>
                            
                            <ul class="tbody">
                                <li class="tr">
                                    <span class="td film-name">毒液</span>
                                    <span class="td filed-time">${new Date().toLocaleDateString()}&nbsp;&nbsp;${field.time}</span>
                                    <span class="td cinemas">${cinema.name}</span>
                                    <span class="td seat">
                                        <span class="hall">${field.hallNumber}</span>
                                    </span>
                                </li>
                            </ul>
                        `;
                        
                    }
                });
                
            });
            return s;
            })()}
        `);
        loadDatas('../json/films.json',(response) => {
            $('.film-name').text(`${(function(){
                let filmStr = "";
                response.forEach(film => {
                    if(filmId == film.id ){
                        filmStr = `
                        ${film.chineseName}
                        `;
                    }
                });
                return filmStr;
            })()}`);
        });
        //下面参数为Pointer字段名称， 可以一次查询多个表
        query.include("username",current.username);
        query.find().then(re => {
            re.forEach((user) => {
                if(user.username == current.username){
                    userId = user.objectId;
                    
                    // 获取选票结果
                    query.get(userId).then(res => {
                        console.log(res);
                        if(res.iscur == true){
                            $('.seat').prepend(`${(function(){
                                let seatStr = '';
                                res.seatArr.forEach((seat,index) => {
                                    seatStr += `
                                    <span class="have-chioce-set">
                                        ${seat[0]}排${seat[1]}座
                                    </span>
                                    `;
                                    
                                });
                                return seatStr;
                            })()}`);
                            // 倒计时
                            var d1 = new Date(res.createdAt);
                            
                            var b = 15;//分钟数
                            d1.setMinutes(d1.getMinutes() + b, d1.getSeconds(), 0);
                            
                            setInterval(function(){
                                var d2 = new Date();
                                var distance = d1 - d2;
    
                                //计算分钟
                                var minutes=Math.floor(distance / 1000 / 60 % 60);
                                if(minutes<10 && minutes>=0){
                                    minutes='0' + minutes;
                                }
    
                                //计算秒数
                                var seconds=Math.floor(distance / 1000 % 60);
                                if(seconds<10 && seconds>=0){
                                    seconds='0' + seconds;
                                }
                                //将时间显示在DOM元素上
                                $('.minutes').text(`${minutes}`);
                                $('.seconds').text(`${seconds}`);
                                
                            },1000);
                            // 更新票价显示
                            $('.total-price').text(`${res.totalprice}`);
                        }
                        
                    }).catch(err => {
                        console.log(err)
                    });
                }
            });
            
            
        }).catch(err => {
            console.log(err)
        })

        
        
    });
    
    
    
});