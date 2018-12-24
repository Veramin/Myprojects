module.exports = {
    // 加载数据
    /**
     * 
     * @param {*} url json数据地址
     * @param {*} success 回调函数，数据请求成功需要做的操作
     */
    loadDatas(url,success){
        $.ajax({
            url: url,
            success: success
        });
    },
    // 判断录状态
    isOnline(){
        if(localStorage.bmob){
            $('.user-infor img').attr('src','https://img.meituan.net/maoyanuser/c524afeb2e56c93093a1b7c26d5ac6b114424.png');
            $('.login a').replaceWith(`
                <div class="online">
                    ${(function(){
                        if($('.menu-list li').hasClass('isShow')){
                            return `<a class="line" href="./static/pages/profile.html">我的订单</a>`;
                        }else{
                            return `<a class="line" href="./profile.html">我的订单</a>`;
                        }
                    })()}
                    
                    <a class="base-infos" href="#">基本信息</a>
                    <a class="exit-login" href="#">退出登录</a>
                </div>
            `);
        }
    
        $('.exit-login').click(() => {
            $('.user-infor img').attr('src','http://p0.meituan.net/movie/7dd82a16316ab32c8359debdb04396ef2897.png');
            if($('.menu-list li').hasClass('isShow')){
                $('.online').replaceWith(`
                <a href="./static/pages/login.html">登录</a>
            `);
            }else{
                $('.online').replaceWith(`
                <a href="./login.html">登录</a>
            `);
            }
            
            Bmob.User.logout();
        });
    },
    //获取url中的参数
    getUrlParam(name) {
        //构造一个含有目标参数的正则表达式对象
        var reg = new RegExp("(^|&)"+ name + "=([^&]*)(&|$)");
        //匹配目标参数
        var r = window.location.search.substr(1).match(reg);
        //返回参数值
        if(r != null)
            return unescape(r[2]);
        return null;
    },
    // tab切换
    /**
     * 
     * @param {*} menus 菜单项集合
     * @param {*} contents 内容项集合
     */
    tabChange(menus,contents){
        menus.each((index,menu) => {
            menu.dataset.index = index;
            $(menu).click((e) => {
                // 获取下标
                let _index = $(e.target).data('index');
                // 清除上一次的样式
                for(let i = 0, len = menus.length; i < len; i++){
                    if($(menus[i]).hasClass('selected')){
                        $(menus[i]).removeClass('selected');
                        $(menus[i]).removeClass('triangle');
                        $(contents[i]).removeClass('show');
                    }
                    
                }
                // 切换选中菜单
                $(e.target).addClass('selected');
                $(e.target).addClass('triangle');
                // 切换内容
                $(contents[_index]).addClass('show');
                   
            });
        });
    },
    /**
     * 
     * @param {*} parentNode  父级元素
     * @param {*} datas       展示的数据
     * @param {*} curIndex    当前显示第几页
     */
    loadingNews(parentNode,datas,curIndex){
        var starIndex = (curIndex - 1) * 7;
        var endIndex  = starIndex + 6;
        if(curIndex == Math.ceil(datas.length / 7)){
            endIndex = datas.length -1;
        }
        //拼接
        var htmlStr = "";
        for(var i = starIndex; i <= endIndex; i++){
            htmlStr += `
                <li class="news-information-item clearFix">
                    <img src="${datas[i].img}" alt="" class="fl">
                    <section class="infos fr">
                        <p class="title">${datas[i].title}</p>
                        <p class="des">${datas[i].des}</p>
                        <p class="other-infos">
                            <span>${datas[i].source}</span>
                            <span>${datas[i].date}</span>
                            ${(function(){
                                if(datas[i].film){
                                    return `<span class="film">${datas[i].film}</span>`;
                                }else{
                                    return '';
                                }
                            })()}
                            <span class="browsing-num">${datas[i].num}</span>
                        </p>
                    </section>
                </li>`;
        }
        parentNode.innerHTML = htmlStr;
    },

    loadingCinemas(parentNode,datas,curIndex,filmId){
        var starIndex = (curIndex - 1) * 7;
        var endIndex  = starIndex + 6;
        if(curIndex == Math.ceil(datas.length / 7)){
            endIndex = datas.length -1;
        }
        //拼接
        var htmlStr = "";
        for(var i = starIndex; i <= endIndex; i++){
            htmlStr += `
                <div class="cinema">
                    <div class="cinema-information">
                        <a href="">${datas[i].name}</a>
                        <p>${datas[i].address}</p>
                    </div>
                    <div  class="cinema-seat">
                        <a class="choose-seat-btn" href="./ballot.html?filmid=${filmId}&cinemaid=${datas[i].id}">选座购票</a>
                    </div>
                    <div class="cinema-price">
                        <span class="cinema-price-first">￥${datas[i].price}</span><span class="cinema-price-last">起</span>
                    </div>
                </div>`;
        }
        parentNode.innerHTML = htmlStr;
    },
    //根据关键字的值的类型筛选json数据
    /**
     * 
     * @param {*} str      json数据关键字stage的类别
     * @param {*} kind     json数据关键字"key"
     * @param {*} datas     传递参数对象
     * 
     */
    choice(str,kind,datas){
        arr = [];
        datas.forEach(obj => {
            
            if(obj[kind].indexOf(str) != -1){
                arr.push(obj);
            }
        });
        return arr;

    },
    //根据关键字筛选json数据
    /**
     * 
     * @param {*} kinds     json数据关键字"key"
     * @param {*} res       传递参数对象
     * 
     */
    choiceKind(kinds,res){
        arr = [];
        res.forEach(obj => {
            if(obj[kinds]){
                arr.push(obj);
            }
        });
        return arr;
    },
    //按照json数据的关键字进行排序
    /**
     * 
     * @param {*} c      json数据排序的关键字
     * 
     */
    compare(c){
        return  function sortId(a,b){  
             return b[c]-a[c]
          }   
      },

    //电影院数据过滤
    /**
     * 
     * @param {*} goodsList      内容容器
     * @param {*} datas         定义对象 列:obj
     * @param {*} keywords      一个对象,列:var keywords  = { color: "", origin: "", kind: ""};
     * 
     */
    loadingGoodsList(goodsList, datas, keywords) {
        let reg = new RegExp(`.*${keywords.brand}.*${keywords.area}.*${keywords.special}`);

        let resArr = datas.filter(function(goods) {

            return reg.test(JSON.stringify(goods));
            
        });console.log(resArr);
       goodsList.html(`${(function(){
        let htmlArr = "";
        
        if(resArr.length === 0){
            htmlArr = `<p class = "no-result">抱歉，没有找到相关结果，请尝试用其他条件筛选!!!</p>`;
        }else{
            resArr.forEach(goods => {
            
                htmlArr += `
                      <div class="cinema">
                          <div class="cinema-information">
                              <a href="">${goods.name}</a>
                              <p>${goods.address}</p>
                          </div>
                          <div  class="cinema-seat">
                              <a class="choose-seat-btn" href="./order.html">选座购票</a>
                          </div>
                          <div class="cinema-price">
                              <span class="cinema-price-first">￥${goods.price}</span><span class="cinema-price-last">起</span>
                          </div>
                      </div>
                  `;
          });
        }
        return  htmlArr;
       })()}
       
   `);
   
    },
    //移除/增加class
    removeClass(elements, className) {
        for (var i = 0, len = elements.length; i < len; i++) {
            if (elements[i].classList.contains(className)) {
                elements[i].classList.remove(className);
                break;
            }
        }
    },
    // 座位显示
    /**
     * 
     * @param {*} arr1 坐标集合
     * @param {*} arr2 坐标
     * @param {*} status 选择状态
     * @param {*} number 选票数量
     * @param {*} unitPrice 单价
     * @param {*} callback 回调函数，将数量和坐标集合传出去
     */
    updateSeat(arr1,arr2,status,number,unitPrice,callback){
        if(status){
            arr1.push(arr2);
        }else{
            var x = [];
            arr1.forEach(item => {
                x.push(item.join(""));
            });

            var y = arr2.join("");
            
            var result= $.inArray(y, x);
            if(result !== -1){
                arr1.splice(result,1);
            }
        }
        // 座位
        $('.have-chioce').html(`
            ${(function(){
                let seatStr = '';
                arr1.forEach((items,index) => {
                        seatStr += `
                        <span class="have-chioce-set">
                            ${items[0]}排${items[1]}座
                            <span class="close"></span>
                        </span>
                        `;
                        
                });
                return seatStr;
            })()}
        `);
        $('.close').click(function(event){
             // 获取对应的选座坐标
             let a = [];
             a[0] = $(event.target).parent().text().trim().split("排")[0];
             a[1] = $(event.target).parent().text().trim().split("排")[1].split("座")[0];
             
             a = a.map(b => +b);
             // 移除坐标集合中的该坐标
            var x = [];
            arr1.forEach(item => {
                x.push(item.join(""));
            });

            var y = a.join("");
            
            var result= $.inArray(y, x);
            if(result !== -1){
                arr1.splice(result,1);
            }
            // 更新座位显示
            $(event.target).parent().remove();
            
             // 移除座位选中样式
             $('.seat-container span').each((index,z) => {
                if(($(z).parent().data('index') === a[0]) && ($(z).data('index') === a[1])){
                    $(z).removeClass('checked');
                }
        
            });
            // 更新数量
            number = number - 1;
            // 边界问题
            if(number == 0){
                number = 0;
                // 更新选择结果显示
                $('.no-chioce-set').removeClass('no-chioce');
                $('.have-chioce').removeClass("show-seat-list");
                $('.totalprice').text("0");
                return; 
            }
            // 计算总价
            // 更新价格显示
            $('.totalprice').text(`${unitPrice * number}`);
            callback(number,arr1);  
        })

        // 计算总价
        // 更新价格显示
        $('.totalprice').text(`${unitPrice * number}`);
    }
    
}