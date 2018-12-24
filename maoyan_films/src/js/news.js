// 导入模块
require('../less/normalized.less');
require('../less/common.less');
require('../less/tab-effect.less');
require('../less/news.less');

// 引入第三方插件
require('../plugin/jquery.pagination.min.js');

var Bmob = require('../js/Bmob-1.6.5.min.js');
 // 授权
 Bmob.initialize("6d6177b31e704b50d09aa56bf53a1358", "089cd1fbb5239d622e549c8f9f2c51f6");

import {loadDatas,tabChange,loadingNews,isOnline} from './tools';

$(function(){
    let menuList = $('.tab-menu li'),
        menuItems = $('.content-item'),
        newsList = $('.news-lis'),
        prevuesList = $('.prevue-list'),
        atlasList = $('.atlas-list'),
        newsInformationList = $('.news-information-lis');

    // 判断登录状态
    isOnline();
    
    // tab菜单切换
    tabChange(menuList,menuItems);
        
    // 最新资讯 
    // 数据加载
    loadDatas("../json/hotspot.json",(response) => {
        newsList.html(`
            ${(function(){
                let lis = '';
                response.newsInformation.forEach(news => {
                    lis += `
                        <li>
                            <img src="${news.img}" title="${response.newsInformation.title}">
                            <p class="title">${news.title}</p>
                            <p class="other-infos clearFix">
                                <span class="source fl">猫眼电影</span>
                                <span class="browsing-num fr">${news.num}</span>
                            </p>
                        </li> 
                    `;  
                });
                return lis;
            })()}
        `);
    });

    // 新闻资讯
    // 数据加载
    loadDatas('../json/news-information.json',(response) => {
        loadingNews(newsInformationList.get(0),response,1);
    });
    // 分页
    $('.pagination').pagination({
        currentPage: 1,
        totalPage: 4,
        showData: 7,
        isShow: false,
        count: 3,
        prevPageText: "上一页",
        nextPageText: "下一页",
        callback: function(current) {
            // 数据加载
            loadDatas('../json/news-information.json',(response) => {
                loadingNews(newsInformationList.get(0),response,current);
            });
        }
    });


    // 预告片
    // 数据加载
    loadDatas('../json/prevue.json',(response) => {
        prevuesList.html(`${(function(){
            let preveuStr = '';
            response.forEach((item) =>{
                preveuStr += `
                    <li>
                        <a class="play-box" href="#">
                            <img src="${item.img}" alt="${item.title}">
                            <div class="play-icon"></div>
                        </a>
                        <a class="title" href="#">${item.title}</a>
                        <p class="num">${item.num}</p>
                    </li>
                `;
            });
            return preveuStr;
        })()}`);
    });

    // 精彩图集
    // 数据加载
    loadDatas('../json/wonderful-atlas.json',(response) => {
        atlasList.html(`${(function(){
            let atlasStr = '';
            response.forEach((atlas) => {
                atlasStr += `
                    <li class="atlas-item">
                        <p class="title">${atlas.title}</p>
                        <ul class="atlas-box clearFix">
                            ${(function(){
                                let imgStr = "";
                                atlas.imgs.forEach(img => {
                                    imgStr += `<li><img src="${img}" alt=""></li>`;
                                });
                                return imgStr;
                            })()}
                        </ul>
                        <p class="other-infos">
                            ${(function(){
                                if(atlas.name){
                                    return `<span class="name">${atlas.name}</span>`;
                                }else{
                                    return '';
                                }
                            })()}
                            <span class="browsing-num">${atlas.num}</span>
                        </p>
                    </li>
                `;
            });
            return atlasStr;
        })()}`);
    });
   
});