require('../less/normalized.less');
require('../less/common.less');
require('../less/details.less');
require('../less/query.less');
require('../less/tab-effect.less');
import {tabChange,loadDatas,isOnline} from './tools';

$(function(){
    let menuList = $('.tab-menu li'),
        menuItems = $('.content-item'),
        menuItemsMove = $('.content-item-move'),
        menuItemsCinema = $('.content-item-cinema'),
        searchInput = $('.search-text'),
        searchBtn = $('.search-btn'),
        movie_ = $('.movie'),
        studios_ = $('.studios');

    // 判断登录状态
    isOnline();
    searchInput.bind("input propertychange",function(){
        console.log(searchInput.val())
         searchBtn.click(function(){
            if(searchInput.val()){
                 //加载影片数据
            loadDatas("../json/films.json",(res) => {

                //数据转换筛选步骤
                let reg = new RegExp(searchInput.val());
                let objArr = res.filter(function(goods) {
                    return reg.test(JSON.stringify(goods));
                });
                console.log(objArr)
                movie_.html(`(${objArr.length})`)
                menuItemsMove.html(`
                    ${(function(){
                        let htmlStr = "";
                        if(objArr.length === 0 ){
                            menuItemsMove.empty();
                                       htmlStr +=`
                                    <div class = "not-data">
                                        <h3>很抱歉，没找到相关的影视剧!!!</h3>
                                        <p>小喵建议您：</p>
                                        <p>1. 请检查输入的关键词是否有误</p>
                                        <p>2. 请缩短关键词</p>
                                    </div>
                                    `
                        }else{
                            objArr.forEach(goods => {
                                menuItemsMove.empty();
                                        htmlStr +=`
                                    <div class = "search-data-box">
                                        <a href = "./details.html?filmid=${goods.id}"><img src="${goods.img}" alt=""></a>
                                        <div>
                                            <p class = "chineseName">${goods.chineseName}</p>
                                            <p class = "nativeName">${goods.nativeName}</p>
                                            <p class = "score">${(function(){
                                                if(goods.score){
                                                    return goods.score
                                                }else{
                                                    return goods.country
                                                }
                                            })()}</p>
                                            <p class = "type">${goods.type}</p>
                                            <p class = "time">${goods.time}</p>
                                        </div>
                                    </div>
                                    `
                            });
                            
                        };return htmlStr;
                    })()}
                `)
            });

            //加载影院数据
            loadDatas("../json/screen-content.json",(res) => {
                //数据转换筛选步骤
                let reg = new RegExp(searchInput.val());
                let resArr = res.filter(function(goods) {
                    return reg.test(JSON.stringify(goods));
                });
                console.log(resArr)
                studios_.html(`(${resArr.length})`)
                menuItemsCinema.html(`
                    ${(function(){
                        let htmlStr = "";
                        if(resArr.length === 0 ){
                            menuItemsCinema.empty();
                                       htmlStr +=`
                                    <div class = "not-data">
                                        <h3>很抱歉，没找到相关的影城!!!</h3>
                                        <p>小喵建议您：</p>
                                        <p>1. 请检查输入的关键词是否有误</p>
                                        <p>2. 请缩短关键词</p>
                                    </div>
                                    `
                        }else{
                            resArr.forEach(goods => {
                                menuItemsCinema.empty();
                                        htmlStr +=`
                                    <div class = "search-cinema-box">
                                        <div>
                                            <p class = "chineseName">${goods.name}</p>
                                            <p class = "nativeName">${goods.address}</p>
                                        </div>
                                        <div>
                                            <span class="eating">小吃</span><span class="set">座位</span>
                                        </div>
                                    </div>
                                    `
                            });
                            
                        };return htmlStr;
                    })()}
                `)
            });
            }
        })   
    }) 

    // tab菜单切换
    tabChange(menuList,menuItems);
})