require('../less/normalized.less');
require('../less/common.less');
require('../less/details.less');
require('../less/cinemas.less');
require('../plugin/jquery.pagination.min.js');
import {loadDatas,loadingCinemas,loadingGoodsList,isOnline,removeClass} from './tools';
var Bmob = require('../js/Bmob-1.6.5.min.js');
 // 授权
 Bmob.initialize("6d6177b31e704b50d09aa56bf53a1358", "089cd1fbb5239d622e549c8f9f2c51f6");


$(function(){
    let brandList = $(".brand-lis");
    let areaList = $(".area-lis");
    let specialList = $(".special-lis");
    let screenlList = $(".screen-content-box");
    
    // 默认电影id
    let filmId = 1;
    // 判断登录状态
    isOnline(); 
    //加载筛选标题部分
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
    loadDatas("../json/screen-content.json",(res) =>{
        loadingCinemas(screenlList.get(0),res,1,filmId);``
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
                loadingCinemas(screenlList.get(0),response,current,filmId);
            });
        }

    });


})