// 导入模块
require('./tools');
require('../less/normalized.less');
require('../less/common.less');
require('../less/tab-effect.less');
require('../less/films.less');
import { loadDatas, isOnline, removeClass } from './tools';

let Bmob = require('../js/Bmob-1.6.5.min.js');
// 授权
Bmob.initialize("6d6177b31e704b50d09aa56bf53a1358", "089cd1fbb5239d622e549c8f9f2c51f6");

/**
 * 用于查询的条件
 */
const query = {
    stage: 'hot',
    type: '',
    country: '',
    time: '',
};


/**
 * 
 * */ 
const recordQuery = {

}


/**
 * 设置查询条件
 */
const setQuery = (data) => {
    if (data.stage !== undefined) {
        query.stage = data.stage;
    }
    if (data.type !== undefined) {
        query.type = data.type;
    }
    if (data.country !== undefined) {
        query.country = data.country;
    }
    if (data.time !== undefined) {
        query.time = data.time;
    }
};

/**
 * 从YYYY-MM-DD格式的日期总抽出四位年份
 * @param {*} time 日期字符串
 * @returns 抽取的的年份,没有抽取到则返回null
 */
const extractYear = (time) => {
    const match = time.match(/\d{4}/);
    return match && match[0];
};


/**
 * 匹配电影的时间
 * @param {*} film 指定的电影对象
 */
const matchTime = (film) => {
    if (!query.time) {
        return true;
    }
    const queryYear = extractYear(query.time);
    const filmYear = extractYear(film.time);
    if (query.time === '更早') {
        return filmYear < 1970;
    } else if (query.time === '70年代') {
        return filmYear < 1980 && filmYear >= 1970;
    } else if (query.time === '80年代') {
        return filmYear < 1990 && filmYear >= 1980;
    } else if (query.time === '90年代') {
        return filmYear < 2000 && filmYear >= 1990;
    } else {
        return filmYear === queryYear;
    }
};


/**
 * 过滤电影
 */
const filterFilms = (films, query) => {
    return films.filter(film => {
        // 匹配分级
        if (film.stage !== query.stage) {
            return false;
        }
        // 匹配国家
        if (query.country && film.country.indexOf(query.country) === -1) {
            return false;
        }
        // 匹配类型
        if (query.type && film.type.indexOf(query.type) === -1) {
            return false;
        }
        // 匹配年代
        if (!matchTime(film)) {
            return false;
        }
        return true;
    });
};

/**
 * 激活一个stage tab
 * @param {*} tabs 
 * @param {*} tab 
 */
const activateStageTab = (tabs, tab) => {
    // 清除上一次的样式
    for (let i = 0, len = tabs.length; i < len; i++) {
        $(tabs[i]).removeClass('selected');
        $(tabs[i]).removeClass('triangle');
    }
    // 切换选中菜单
    $(tab).addClass('selected');
    $(tab).addClass('triangle');
};


/**
 * 组装typelist
 */
const composeTypeList = (response) => {
    const container = $('.type-list');
    const typeContainer = response.type;

    // 重新组装
    let htmlStr = '';
    typeContainer.forEach((name, index) => {
        if (index == 0) {
            htmlStr += `<li class="list-li active">${name}</li>`;
        } else {
            htmlStr += `<li class="list-li">${name}</li>`;
        }

    });
    container.html(htmlStr);
};

/**
 * 组装area list
 */
const composeAreaList = (response) => {
    const container = $('.area-list');
    const areaContainer = response.area;

    // 重新组装
    let htmlStr = '';
    areaContainer.forEach((name, index) => {
        if (index == 0) {
            htmlStr += `<li class="list-li active">${name}</li>`;
        } else {
            htmlStr += `<li class="list-li">${name}</li>`;
        }
    });
    container.html(htmlStr);
};

/**
 * 组装time list
 * @param {} response 
 */
const composeTimeList = (response) => {
    const container = $('.era-list');
    const eraContainer = response.era;
    let htmlStr = '';
    // 重新组装
    eraContainer.forEach((name, index) => {
        if (index == 0) {
            htmlStr += `<li class="list-li active">${name}</li>`;
        } else {
            htmlStr += `<li class="list-li">${name}</li>`;
        }
    });
    container.html(htmlStr);
};

/**
 * 渲染电影,渲染之前会对电影进行筛选
 */
function renderFilms() {
    const films = loadedFilms;
    const container = $(".film-content");
    const filteredFilms = filterFilms(films, query);
    // 清空
    container.empty();
    let htmlStr = '';
    // 重新组装
    filteredFilms.forEach((film) => {
        htmlStr += `<section class="fl">
            <a href="./details.html?filmid=${film.id}">
                <img src=${film.img} alt="">`;

        if (query.stage === 'hot') {
            htmlStr += '<p class="sale">购票</p>';
        }
        if (film.mode) {
            htmlStr += `<span class="view-type">${film.mode}</span>`;
        }
        htmlStr += ` </a>
             <p class="film-name ellipsis">${film.chineseName}</p>`;
        if (query.stage == 'hot') {
            htmlStr += `<i class="film-score">${film.score}</i>`;
        } else if (query.stage == 'willCome') {
            htmlStr += `<p class="want-to-see">${film.wantToSee}人想看</p>`;
        } else {
            htmlStr += `<i class="film-score">${film.score}</i>`;
        }
        htmlStr += `</section>`;
    });
    container.html(htmlStr);
}



/**
 * 加载搜索区域,并添加相应的事件监听
 */
const loadSearchZone = () => {
    // 动态加载页面内容
    loadDatas('../json/search-films.json', (response) => {
        composeTypeList(response);
        composeAreaList(response);
        composeTimeList(response);

        const types = $(".type-list li");
        const areas = $(".area-list li");
        const eras = $(".era-list li");
        //事件添加
        types.each((index, typesItem) => {

            $(typesItem).on('click', function (e) {
                //清除样式
                removeClass(types, "active");
                //添加样式
                this.classList.add("active");
                const type = $(e.target).text() === "全部" ? "" : $(e.target).text();
                setQuery({ type: type });
                renderFilms();
            });
        });

        areas.each((index, areasItem) => {
            $(areasItem).on('click', function (e) {
                //清除样式
                removeClass(areas, "active");
                //添加样式
                this.classList.add("active");
                const country = $(e.target).text() === "全部" ? "" : $(e.target).text();
                setQuery({ country: country });
                renderFilms();
            });
        });
        eras.each((index, erasItem) => {
            $(erasItem).on('click', function (e) {
                //清除样式
                removeClass(eras, "active");
                //添加样式
                this.classList.add("active");
                const time = $(e.target).text() === "全部" ? "" : $(e.target).text();
                setQuery({ time: time });
                renderFilms();
            });
        });
    });
};

let loadedFilms = null;


const loadFilms = (callback) => {
    loadDatas("../json/films.json", (r) => {
        loadedFilms = r;
        callback && callback(r);
    });
};



/**
 * 监听stage tabs点击事件并进行处理
 */
const watchStageTabClick = () => {
    const tabs = $('.tab-menu li');
    $('.tab-menu .hot').on('click', function (e) {
        setQuery({ stage: 'hot' });
        activateStageTab(tabs, e.target);
        renderFilms(loadedFilms);
    });
    $('.tab-menu .willCome').on('click', function (e) {
        setQuery({ stage: 'willCome' });
        activateStageTab(tabs, e.target);
        renderFilms(loadedFilms);
    });
    $('.tab-menu .best').on('click', function (e) {
        setQuery({ stage: 'top100' });
        activateStageTab(tabs, e.target);
        renderFilms(loadedFilms);
    });
};



$(function () {
    // 判断登录状态
    isOnline();
    
    watchStageTabClick();
    loadSearchZone();
    loadFilms(() => {
        // 主页
        renderFilms();
    });

});

