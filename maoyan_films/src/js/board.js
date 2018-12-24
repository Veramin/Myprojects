require('../less/normalized.less');
require('../less/common.less');
require('../less/tab-effect.less');
require('../less/board.less');
import {tabChange,loadDatas,compare,choice,isOnline} from './tools';

var Bmob = require('../js/Bmob-1.6.5.min.js');
 // 授权
 Bmob.initialize("6d6177b31e704b50d09aa56bf53a1358", "089cd1fbb5239d622e549c8f9f2c51f6");

$(function(){
    let menuList = $('.tab-menu li'),
        menuItems = $('.content-item'),
        receivedList = $('.well-received'),
        expectedList = $('.most-expected'),
        domesticFilmList = $('.domestic-film'),
        americanList = $('.north-american-film'),
        topreceivedList = $('.top100'),
        dataTime = $('.data-time'),
        myDate = new Date();//获取系统当前时
    
    // 判断登录状态
    isOnline();

    //拼接加载当前时间    
    dataTime.html(`
            ${myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate()}
    `)
    // tab菜单切换
    tabChange(menuList,menuItems);

    //加载json数据
    loadDatas("../json/films.json",(res) => {
       res.sort(compare("score"));
        //加载热映口碑榜
        receivedList.html(
            `
                ${(function(){
                     let htmlStr = "";
                     res.forEach((item,index) => {
                         if(item.stage == "hot"){
                            if(index < 10){
                                htmlStr +=
                            `
                            <li class="all-list">
                                <i class="all-serial-number">${index+1}</i>
                                <a href="./details.html?filmid=${item.id}">
                                    <img src="${item.img}" alt="">
                                </a>
                                <div class="all-right-box">
                                    <div class="all-information">
                                        <h3><a>${item.chineseName}</a></h3>
                                        <div>主演：${(function(){
                                                    let itemStr = `<span class = "all-name">`
                                                        item.performers.actor.forEach( obj => {
                                                            itemStr+= `&nbsp${obj.name}`
                                                        });
                                                        itemStr += `</span>`
                                                        return itemStr
                                                })()}
                                        </div>
                                        <p>上映时间：${item.time}</p>
                                    </div>
                                    <div  class="all-score">
                                        <span>${item.score}</span>
                                    </div>
                                </div>
                            </li>
                            `
                            }
                         }
                     });
                     return htmlStr
                })()}
            `
        )
        //加载国内票房榜
        domesticFilmList.html(
            `
                ${(function(){
                    // let country = res.country;
                    let obj = choice("中国大陆","country",res),
                        stage_obj = choice("hot","stage",obj);
                        stage_obj.sort(compare("ticket"));
                     let htmlStr = "";
                     stage_obj.forEach((item,index) => {
                        if(index < 10){
                            htmlStr +=
                        `
                        <li class="all-list">
                            <i class="all-serial-number">${index+1}</i>
                            <a href="./details.html?filmid=${item.id}">
                                <img src="${item.img}" alt="">
                            </a>
                            <div class="all-right-box">
                                <div class="all-information">
                                    <h3><a>${item.chineseName}</a></h3>
                                    <div>主演：${(function(){
                                        let itemStr = `<span class = "all-name">`
                                            item.performers.actor.forEach( obj => {
                                                itemStr+= `&nbsp${obj.name}`
                                            });
                                            itemStr += `</span>`
                                            return itemStr
                                    })()}
                            </div>
                                    <p>上映时间：${item.time}</p>
                                </div>
                                <div  class="all-score ">
                                    <span class="all-ticket">总票房:<span>${item.ticket}</span>万</span>
                                </div>
                            </div>
                        </li>
                        `
                        }
                     });
                     return htmlStr
                })()}
            `
        )
         //加载北美票房榜
         americanList.html(
            `
                ${(function(){
                    let obj = choice("美国","country",res),
                        hot_obj = choice("hot","stage",obj),
                        htmlStr = ""; 
                        hot_obj.sort(compare("ticket"));
                     hot_obj.forEach((item,index) => {
                         if(index<10){
                            htmlStr +=
                            `
                            <li class="all-list">
                                <i class="all-serial-number">${index+1}</i>
                                <a href="./details.html?filmid=${item.id}">
                                    <img src="${item.img}" alt="">
                                </a>
                                <div class="all-right-box">
                                    <div class="all-information">
                                        <h3><a>${item.chineseName}</a></h3>
                                        <div>主演：${(function(){
                                            let itemStr = `<span class = "all-name">`
                                                item.performers.actor.forEach( obj => {
                                                    itemStr+= `&nbsp${obj.name}`
                                                });
                                                itemStr += `</span>`
                                                return itemStr
                                        })()}
                                </div>
                                        <p>上映时间：${item.time}</p>
                                    </div>
                                    <div  class="all-score">
                                    <span class="all-ticket">总票房:<span>${item.ticket}</span>万</span>
                                    </div>
                                </div>
                            </li>
                            `
                         }
                     });
                     return htmlStr
                })()}
            `
        )
        //加载top100榜单
        topreceivedList.html(
            `
           ${(function(){     
              let   htmlStr = "";
                    choice("top100","stage",res);
                    arr.sort(compare("score"));
                    arr.forEach((item,index) => {
                        htmlStr +=
                        `
                        <li class="all-list">
                            <i class="all-serial-number">${index+1}</i>
                            <a href="./details.html?filmid=${item.id}">
                                <img src="${item.img}" alt="">
                            </a>
                            <div class="all-right-box">
                                <div class="all-information">
                                    <h3><a>${item.chineseName}</a></h3>
                                    <div>主演：${(function(){
                                        let itemStr = `<span class = "all-name">`
                                            item.performers.actor.forEach( obj => {
                                                itemStr+= `&nbsp${obj.name}`
                                            });
                                            itemStr += `</span>`
                                            return itemStr
                                    })()}
                            </div>
                                    <p>上映时间：${item.time}</p>
                                </div>
                                <div  class="all-score">
                                    <span>${item.score}</span>
                                </div>
                            </div>
                        </li>
                        `
                    });
                    return htmlStr
           })()}
            `
        ),
        //加载最受期待
        expectedList.html(
            `
            ${(function(){
                let htmlStr = "",
                    obj = choice("willCome","stage",res),
                      _obj  = obj.sort(compare("wantToSee"));
                      
                      _obj.forEach((item,index) => {
                    htmlStr +=
                    `
                    <li class="all-list">
                        <i class="all-serial-number">${index+1}</i>
                        <a href="./details.html?filmid=${item.id}">
                            <img src="${item.img}" alt="">
                        </a>
                        <div class="all-right-box">
                            <div class="all-information">
                                <h3><a>${item.chineseName}</a></h3>
                                <div>主演：${(function(){
                                                let itemStr = "";
                                                if(item.performers.actor){
                                                    
                                                    item.performers.actor.forEach((actor) => {
                                                        itemStr += `<span class = "all-name">&nbsp;&nbsp;${actor.name}</span>`
                                                    })
                                                }
                                                return itemStr
                                        })()}
                                </div>
                                <p>上映时间：${item.time}</p>
                            </div>
                            <div  class="all-score">
                                <span class="want-to-see">本月新增想看:${item.wantToSee}</span>
                            </div>
                        </div>
                    </li>
                    `;
                     }); 
                     return htmlStr;
            })()}
            `
        );
    })
})
