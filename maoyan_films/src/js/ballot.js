require('../less/normalized.less');
require('../less/common.less');
require('../less/details.less');
require('../less/choose-seat.less');
require('../less/ballot.less');
import {loadDatas,isOnline,getUrlParam} from './tools';
var Bmob = require('../js/Bmob-1.6.5.min.js');
 // 授权
 Bmob.initialize("6d6177b31e704b50d09aa56bf53a1358", "089cd1fbb5239d622e549c8f9f2c51f6");

$(function(){
    // 判断登录状态
    isOnline();
    
    // 获取影院id
    var cinemaId = getUrlParam('cinemaid');
    console.log(cinemaId);
    // 获取电影id
    var filmId = getUrlParam('filmid');
    console.log(filmId);
    // 加载影院数据
    loadDatas('../json/screen-content.json',(res) => {
        $('.cinmas-box').html(`${(function(){
            
            let cinemaStr = "";
            res.forEach(cinema => {
                if(cinemaId == cinema.id ){
                    cinemaStr = `
                    <section class="bg-box c-bg-box">
                    <section class="content-box width-range">
                            <section class="content clearFix">
                                <div class="img-box c-img-box fl">
                                    <img src="${cinema.img}" alt="">
                                </div>
                                <section class="film-infos fl">
                                    <h1 class="chinese-name name">${cinema.name }</h1>
                                    <p class="address">${cinema.address}</p>
                                    <p class="tel">电话：${cinema.tel}</p> 
                                </section>
                            </section>
                    </section>
                    `;
                }
            });
            return cinemaStr;
        })()}`);
        $('.cinemas-field').html(`  
            ${(function(){
            let s = "";
            res.forEach(cinema => {
                if(cinemaId == cinema.id 

){
                    s = `
                    <section class="thead">
                        <span class="td">放映时间</span>
                        <span class="td">语言版本</span>
                        <span class="td">放映厅</span>
                        <span class="td">售价（元）</span>
                        <span class="td">选座购票</span>
                    </section>
                    
                    <ul class="tbody">
                        ${(function(){
                            let fieldStr = ``;
                            cinema.field.forEach((field,index) => {
                                fieldStr += `
                                <li class="tr">
                                    <span class="td startTime">
                                        ${field.time}
                                        <span class="endTime">${field.endTime}散场</span>
                                    </span>
                                    <span class="td language">${field.language}</span>
                                    <span class="td hallNumber">${field.hallNumber}</span>
                                    <span class="td price"><span class="meiyuanfu">￥</span>${field.price}</span>
                                    <span class="td cinema-seat c-cinema-seat">
                                        <a class="choose-seat-btn" href="./order.html?filmId=${filmId}&cinemaId=${cinemaId}&fieldId=${index + 1}">选座购票</a>
                                    </span>
                                `;
                            });
                            return fieldStr;
                        })()}
                    </ul>
                    `;
                }
            });
            return s;
            })()}
        `);
    });
    // 加载电影数据
    loadDatas('../json/films.json',(response) => {
        $('.film-info-box').html(`${(function(){
            
            let filmStr = "";
            response.forEach(film => {
                if(filmId == film.id ){
                    filmStr = `
                    <h1 class="film-title">${film.chineseName}<strong class="score">${film.score}</strong><span>分</span></h1>
                    <p class="other-infos">
                        <span class="timeDuration">时长：<span>${film.timeDuration}</span></span>
                        <span class="type">类型：<span>${film.type}</span></span>
                        <span class="director">主演：<span>${film.performers.actor[0].name}</span></span>
                    </p>
                    `;
                }
            });
            return filmStr;
        })()}`);
    });
});