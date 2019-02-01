// 导入模块
import Swiper from '../../node_modules/swiper/dist/js/swiper.min.js';

require('./tools');
require('../less/normalized.less');
require('../less/common.less');
require('../less/index.less');
import {loadDatas, choice, compare, choiceKind, isOnline} from './tools';
let Bmob = require('../js/Bmob-1.6.5.min.js');
  // 授权
  Bmob.initialize("6d6177b31e704b50d09aa56bf53a1358", "089cd1fbb5239d622e549c8f9f2c51f6");

/**
*
* 
* */
const choiceTiket = (item, res) => {
  arr = [];
  res.forEach(obj => {
      if(obj[item] && obj[item] !== '暂无'){
          arr.push(obj);
      }
  });
  return arr;
}


$(function() {
  //  首页轮播图 
  let mySwiper = new Swiper ('#swiper-container-id', {
      autoplay:true,
      direction: 'horizontal',
      loop: true,
      pagination: {
        el: '.swiper-pagination',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
  }),
  // 首页获取当前时间
      myDate = new Date();//获取系统当前时
      $('.BJTime').text(`${'北京时间' + myDate.toLocaleString('chinese', { hour12: false }).slice(10, 19)}`);

  // 判断登录状态
  isOnline();    
  // 首页动态加载
  loadDatas("../static/json/films.json",(response) => {
    // 加载正在热映的数据
    $('.hotPlaying-box').html(`
      ${(function() {
        // 字符串的方法
        let htmlStr = "";
        response.forEach((movie, index)=> {
          if(movie.stage == "hot") {
            if(index < 8){
              htmlStr +=`
                  <section class="fl">
                    <a href="./static/pages/details.html?filmid=${movie.id}">
                        <img src=${movie.img} alt="">
                        <p class="film-name ellipsis">${movie.chineseName}</p>
                        <span class="film-score">${movie.score}</span>
                        ${(function() {
                          if(movie.mode) {
                            return  `<span class="view-type">${movie.mode}</span>`;
                          }else { return "";}
                        })()}
                        <span class="box-shadow"></span>
                        <div class="mask">
                          <div class="mask-box">
                            <div class="ico">
                              <i class="iconfont icon-dianying"></i>
                              <i class="iconfont icon-gouwuche"></i>
                            </div>
                            <span>${movie.type}</span>
                          </div>
                        </div>
    
                    </a>
                    <p class="buy-ticket"><a href="./static/pages/vote.html?filmid=${movie.id}">购票</a></p>
                  </section>
              `
            }
          }else { return "";}
        });
        return htmlStr;
      })()}
    `) ;
    // 加载即将上映的数据
    $('.upcoming-box').html(`
      ${(function() {
        // 数组的方法
        let htmlArr = [];
        choice("willCome", 'stage', response).forEach((obj, index) => {
          if(index < 8) {
            htmlArr.push(`
            <div class="upcoming-container fl">
              <section class="fl">
                <a href="./static/pages/details.html?filmid=${obj.id}" class="infor-link">
                    <img src=${obj.img} alt="">
                    <p class="film-name ellipsis">${obj.chineseName}</p>
                    ${(function() {
                      if(obj.mode) {
                        return `<span class="view-type">${obj.mode}</span>`
                      }else { return "";}
                    })()}
                    <span class="box-shadow"></span>
                    <div class="mask">
                      <div class="mask-box">
                          <div class="ico">
                            <i class="iconfont icon-dianying"></i>
                            <i class="iconfont icon-gouwuche"></i>
                          </div>
                          <span>${obj.type}</span>
                      </div>
                    </div>
                </a>
                  <p class="want-to-see">${obj.wantToSee}人想看</p>
                  <div class="other">
                      <span class="video-introduce">预告片</span>
                      <span class="pre-sale"><a href="./static/pages/vote.html?filmid=${obj.id}" class="pre-sale-link">预售</a></span>
                  </div>
              </section>
              <p class="upcoming-date">${obj.time}</p>
            </div>
            `)
          }
        })
        return htmlArr.join("")
      })()}
    `);
    // 加载今日票房的数据
    $('.ticket-wrapper').html(`
      ${(function() {
        let htmlStr = '';
        choiceTiket('ticket', response).sort(compare('ticket')).forEach((movie, index) => {
          if(index > 10) {return '';}
          else if(index < 1) {
            htmlStr += `
                    <li class="rank-item rank-item-top">
                      <a href="./static/pages/details.html?filmid=${movie.id}">
                          <img class="fl champion-img" src=${movie.img} alt="">
                          <span class="champion-logo"></span>
                          <div class="infor">
                              <p class="name">${movie.chineseName}</p>
                              <p class="count">${movie.ticket}万</p>
                          </div>
                      </a>
                    </li>
            ` 
            return htmlStr;
          }else if(index< 3) {
            htmlStr += `
            <li class="rank-item">
              <a href="./static/pages/details.html?filmid=${movie.id}">
                  <span class="narmal-link">
                      <i class="best">${++index}</i>
                      <span class="name">${movie.chineseName}</span>
                  </span>
                  <span class="normal-count">${movie.ticket}万</span>
              </a>
            </li>
            `
            return htmlStr
          }else {
            htmlStr += `
            <li class="rank-item">
              <a href="./static/pages/details.html?filmid=${movie.id}">
                  <span class="narmal-link">
                      <i class="normal-color">${++index}</i>
                      <span class="name">${movie.chineseName}</span>
                  </span>
                  <span class="normal-count">${movie.ticket}万</span>
              </a>
            </li>
            `
            return htmlStr;
          }
        })
        return htmlStr;
      })()}
    `)
    // 加载最受期待榜单
    $('.hope-wrapper').html(`
      ${(function() {
        let htmlStr = '';
        choiceKind('wantToSee',response).sort(compare('wantToSee')).forEach((movie, index) => {
          if(index > 10) {return '';}
          else if(index < 1) {
            htmlStr += `
                    <li class="rank-item rank-item-top">
                      <a href="./static/pages/details.html?filmid=${movie.id}">
                          <img class="fl hope-img" src=${movie.img} alt="">
                          <span class="hope-logo"></span>
                          <div class="infor">
                              <p class="name">${movie.chineseName}</p>
                              <p class="count">${movie.wantToSee}人想看</p>
                          </div>
                      </a>
                    </li>
            ` 
            return htmlStr;
          }else if(index < 3) {
            htmlStr += `
                    <li class="rank-item">
                      <a href="./static/pages/details.html?filmid=${movie.id}">
                          <span class="narmal-link">
                              <i class="best">${index}</i>
                              <span class="name">${movie.chineseName}</span>
                          </span>
                          <span class="normal-count">${movie.wantToSee}人想看</span>
                      </a>
                    </li>
            `
            return htmlStr
          }else {
            htmlStr += `
                    <li class="rank-item">
                      <a href="./static/pages/details.html?filmid=${movie.id}">
                          <span class="narmal-link">
                              <i class="normal-color">${index}</i>
                              <span class="name">${movie.chineseName}</span>
                          </span>
                          <span class="normal-count">${movie.wantToSee}人想看</span>
                      </a>
                    </li>
            `
            return htmlStr
          }
        });
        return htmlStr;
      })()}
    `)
    // 加载TOP100榜单
    $('.top-wrapper').html(`
      ${(function() {
        let htmlStr = '';
        choice('top100','stage',response).sort(compare('score')).forEach((movie, index) => {
          if(index < 1) {
            htmlStr += `
                    <li class="rank-item rank-item-top">
                      <a href="./static/pages/details.html?filmid=${movie.id}">
                          <img class="fl" src=${movie.img} alt="">
                          <span class="hope-logo"></span>
                          <div class="infor">
                              <p class="name">${movie.chineseName}</p>
                              <p class="count">${movie.score}分</p>
                          </div>
                      </a>
                    </li>
                    ` 
                    return htmlStr;
          }else if(index < 3){
            htmlStr += `
                    <li class="rank-item">
                      <a href="./static/pages/details.html?filmid=${movie.id}">
                          <span class="narmal-link">
                              <i class="best">${++index}</i>
                              <span class="name">${movie.chineseName}</span>
                          </span>
                          <span class="normal-count count">${movie.score}分</span>
                      </a>
                    </li>
                    `
                    return htmlStr;
          }else {
            htmlStr += `
            <li class="rank-item">
              <a href="./static/pages/details.html?filmid=${movie.id}">
                  <span class="narmal-link">
                      <i class="normal-color">${++index}</i>
                      <span class="name">${movie.chineseName}</span>
                  </span>
                  <span class="normal-count count">${movie.score}分</span>
              </a>
            </li>
            `
            return htmlStr;
          }
        });
        return htmlStr;
      })()}
    `)
  });

      


     
  

});