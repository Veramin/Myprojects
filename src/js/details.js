// 导入模块
require('../less/normalized.less');
require('../less/common.less');
require('../less/details.less');

import {tabChange,loadDatas,getUrlParam} from './tools';

$(function(){
    let menus          = $('.tab-menu li');
    let contents       = $('.content-item'),
        filmHead       = $('.content'),
        filmStory      = $('.story-box'),
        filmPerformers = $('.performers'),
        filmPrize      = $('.prize'),
        filmAtlas      = $('.atlas');

    // 获取电影id
    var id = getUrlParam('filmid');
    console.log(id);
    // 数据加载
    loadDatas('../json/films.json',(response) => {
        filmHead.html(`
            ${(function(){
                let filmStr = '';
                response.forEach(film => {
                    if(id == film.id){
                        // 修改网页标题
                        document.title = `${film.chineseName} - 猫眼电影-一网打尽好电影`;
                        filmStr += `
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
                                    return `<a class="buy-btn" href="./vote.html?filmid=${film.id}">${film.buy}</a>`;
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
                    `;
                    }
                });
                return filmStr;
            })()}
        `);
        // 简介
        filmStory.html(`${(function(){
            let storyStr = '';
            response.forEach(item => {
                if(id == item.id){
                    storyStr += `
                <p class="story">
                    ${item.introduce}
                </p>
                `;
                }
            });
            return storyStr;
        })()}`);
        // 演职人员
        filmPerformers.html(`${(function(){
            let performersStr = '';
            response.forEach(film => {
                if(id == film.id){
                    performersStr += `
                    <section class="director">
                        <p class="dir">导演</p>
                        <span class="director-num">(${film.performers.director.length})</span>
                        <ul class="clearFix">
                        ${(function(){
                            let directorStr = '';
                            // 导演
                            film.performers.director.forEach(director => {
                                directorStr += `
                                    <li class="fl">
                                        <img src="${director.photo}" alt="${director.name}">
                                        <p class="director-name">${director.name}</p>
                                    </li> 
                                `;
                            });
                            return directorStr;
                        })()}
                        </ul>
                    </section>
                    
                    ${(function(){
                        // 演员
                        if(film.performers.actor){
                            let actorStr = '';
                            
                                actorStr += `
                                    <section class="actor">
                                        <p class="act">演员</p>
                                        <span class="actor-num">(${film.performers.actor.length})</span>
                                        <ul class="clearFix">
                                        ${(function(){
                                            let actorLis = '';
                                            film.performers.actor.forEach((actor,index) => {
                                                actorLis += `
                                                    <li class="fl">
                                                        <img src="${actor.photo}" alt="${actor.name}">
                                                        <p class="actor-name">${actor.name}</p>
                                                        <p class="play-name">${actor.play}</p>
                                                    </li> 
                                                `;
                                            });
                                            return actorLis;
                                        })()}
                                        </ul>
                                    </section>
                                `;
                            
                            return actorStr;
                        }else{
                            return '';
                        }
                    })()}
                    
                `;
                }
            });
            return performersStr;
        })()}`);
        // 奖项
        filmPrize.html(`${(function(){
            let prizeStr = '';
            response.forEach(film => {
                if(id == film.id){
                    prizeStr += `
                    ${(function(){
                        let str = '';
                        if(film.prize != null){
                            film.prize.forEach(prize => {
                                str += `
                                    <li>
                                        <section class="clearFix">
                                            <img class="fl" src="${prize.logo}" alt="${prize.title}">
                                            <span class="title fl">${prize.title}</span>
                                        </section>
                                        <p class="details">提名：${prize.details}</p>
                                    </li>
                                `;
                                return str;
                            });
                        }else{
                            return '';
                        }
                        return str;
                    })()}
                `;
                }
            });
            return prizeStr;
        })()}`);
        // 精彩图集
        filmAtlas.html(`${(function(){
            let atlasStr = '';
            
            response.forEach(film => {
                
                if(id == film.id){
                    film.atlas.forEach(atlas => {
                    
                        console.log(atlas);
                        if(id == film.id){
                            atlasStr += `<img class="fl" src="${atlas}" alt="">`;
                        }
                    });
                }
            });
            return atlasStr;
        })()}`);

    });
    // tab切换
    tabChange(menus,contents);

    



});