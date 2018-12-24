require('../less/normalized.less');
require('../less/common.less');
require('../less/details.less');

require('../less/cinemas.less');
require('../less/vote.less');
import {loadDatas,loadingCinemas,loadingGoodsList,isOnline,getUrlParam,removeClass} from './tools';
var Bmob = require('../js/Bmob-1.6.5.min.js');
require('../plugin/jquery.pagination.min.js');
 // 授权
 Bmob.initialize("6d6177b31e704b50d09aa56bf53a1358", "089cd1fbb5239d622e549c8f9f2c51f6");

$(function(){
    let brandList = $(".brand-lis");
    let areaList = $(".area-lis");
    let specialList = $(".special-lis");
    let screenlList = $(".screen-content-box");
    // 判断登录状态
    isOnline();
    // 获取电影id
    var filmId = getUrlParam('filmid');
    console.log(filmId);
    // 加载电影详情数据
    loadDatas("../json/films.json",(res) => {
        $('.isbuy').html(`${(function(){
            
            let str = "";
            res.forEach(film => {
                if(filmId == film.id){
                    str = `
                    <section class="bg-box">
                    <section class="content-box width-range">
                            <section class="content clearFix">
                                <div class="img-box fl">
                                    <img src="${film.img}" alt="">
                                </div>
                                <section class="film-infos fl">
                                    <h1 class="chinese-name">${film.chineseName}</h1>
                                    <h2 class="native-name">${film.nativeName}</h2>
                                    <p class="type">${film.type}</p>
                                    <p class="country-timeDuration">
                                        <span class="country">${film.country} /</span>
                                        <span class="timeDuration">${film.timeDuration}</span>
                                    </p>
                                    <p class="time">${film.time}大陆上映</p>
                                    <p class="want-to-see">
                                        <span><i class="heart"></i>想看</span>
                                        <span><i class="start"></i>评分</span>
                                    </p>
                                    ${(function(){
                                        if(film.buy){
                                            return `<a class="buy-btn" href="#">查看更多电影详情</a>`;
                                        }else{
                                            return '';
                                        }
                                    })()}
                                    
                                </section>
                                <section class="others fl">
                                    ${(function(){
                                        if(film.score){
                                            return `
                                            <section class="score">
                                                <span>用户评分</span>
                                                <strong class="score-num">${film.score}</strong>
                                            </section>
                                            `;
                                        }else if(film.wantToSee){
                                            return `
                                            <section class="score">
                                                <span>想看人数</span>
                                                <strong class="score-num">${film.wantToSee}</strong>
                                            </section>
                                            `;
                                        }
                                    })()}
                                    
                                    <section class="ticket">
                                        <span>累计票房</span>
                                        <strong class="ticket-num">13.42</strong><span class="yi">亿</span>
                                    </section>
                                </section>
                            </section>
                    </section>
                    `;
                }
            });
            return str;
        })()}`);
    });

    loadDatas("../json/screen-title.json",(res) => {
        brandList.html(`
            ${(function(){
                let htmlStr = "";
                res.brand.forEach((item,index) => {
                    htmlStr += 
                    `
                    ${(function(){
                        if(index == 0){
                            return htmlStr += `
                                <li class="fl selected"><a>${item}</a></li>
                            `;
                        }else{
                            return `<li class="fl"><a>${item}</a></li>`
                        }
                            
                        // return htmlStr
                    })()}
                            
                        
                    `
                });
                return htmlStr;
            })()}
        `);
        areaList.html(`
            ${(function(){
                let htmlStr = "";
                res.region.forEach((item,index) => {
                    if(index == 0){
                        return  htmlStr += 
                    `
                        <li class="fl selected">
                            <a>${item.area}</a>
                            ${(function(){
                                if(item.number){
                                    return `
                                    <ul class="hidden">
                                    <li class="fl ">${(function(){
                                        
                                        if(item.number.route){
                                            return `${item.number.route}`
                                        }else{
                                            return `${item.number}`
                                        }
                                    })()}
                                        
                                    </li>
                                    </ul>
                                    `
                                }else{
                                    return ""
                                }
                                
                            })()}
                        </li> 
                    `
                    }else{
                        return htmlStr += `
                        <li class="fl">
                            <a>${item.area}</a>
                            ${(function(){
                                if(item.number){
                                    return `
                                    <ul class="hidden">
                                    <li class="fl ">${(function(){
                                        
                                        if(item.number.route){
                                            return `${item.number.route}`
                                        }else{
                                            return `${item.number}`
                                        }
                                    })()}
                                        
                                    </li>
                                    </ul>
                                    `
                                }else{
                                    return ""
                                }
                                
                            })()}
                        </li> 
                    `
                    }
                });
                return htmlStr;
            })()}
        `);
        specialList.html(`
            ${(function(){
                let htmlStr = "";
                res.Special.forEach((item,index) => {
                    htmlStr += 
                    `
                        ${(function(){
                            if(index == 0){
                                return htmlStr += `
                                    <li class="fl selected"><a>${item}</a></li>
                                `;
                            }else{
                                return `<li class="fl"><a>${item}</a></li>`
                            }
                        })()}
                    `
                });
                return htmlStr;
            })()}
        `);
        let brands = $(".brand-lis li"),
            areas = $(".area-lis .fl"),
            specials = $(".special-lis .fl");
        let keywords = {
            brand: "",
            area: "",
            special: ""
        };
        //事件添加
        brands.each( (index,brandsItem) => {
            
            $(brandsItem).on('click',function(e){
            let a = "";
                //清除样式
                removeClass(brands,"selected");
                //添加样式
                this.classList.add("selected");
                 a = $(e.target).text() === "全部" ? "" : $(e.target).text();
                keywords.brand = a;
                 loadDatas("../json/screen-content.json",(r) =>{
                    loadingGoodsList(screenlList, r, keywords);
                    
                });
                // 隐藏分页
                $('.page').css({"display": "none"});
    
            })
        });
        areas.each( (index,brandsItem) => {
            $(brandsItem).on('click',function(e){
                let b = "";
                //清除样式
                removeClass(areas,"selected");
                //添加样式
                this.classList.add("selected");
                b = $(e.target).text() === "全部" ? "" : $(e.target).text();
                keywords.area = b;
                loadDatas("../json/screen-content.json",(r) =>{
                    loadingGoodsList(screenlList, r, keywords);
                    
                });
                // 隐藏分页
                $('.page').css({"display": "none"});
            })
        });
        specials.each( (index,brandsItem) => {
            $(brandsItem).on('click',function(e){
                let c = "";
                //清除样式
                removeClass(specials,"selected");
                //添加样式
                this.classList.add("selected");
                c = $(e.target).text() === "全部" ? "" : $(e.target).text();
                keywords.special = c;
                loadDatas("../json/screen-content.json",(r) =>{
                    loadingGoodsList(screenlList, r, keywords);
                    
                });
                // 隐藏分页
                $('.page').css({"display": "none"});
            })
        });
    })
    let goodsList  = $('.screen-content-box');
    
    loadDatas("../json/screen-content.json",(res) =>{
        loadingCinemas(screenlList.get(0),res,1,filmId);
            
    })
    // 分页
    $('.page').pagination({
        currentPage: 1,
        totalPage: 10,
        showData: 7,
        isShow: false,
        count: 3,
        prevPageText: "上一页",
        nextPageText: "下一页",
        callback: function(current) {
            // 数据加载
            loadDatas("../json/screen-content.json",(response) => {
                loadingCinemas(screenlList.get(0),response,current);
            });
        }

    });
});