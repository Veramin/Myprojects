// 引入
const webpack = require('webpack');
const path    = require('path');
const Entry    = require('./entry');
const Loader    = require('./loader');
const Plugins    = require('./plugins');
const Server    = require('./server');

// 导出配置
module.exports = {
    context: path.resolve(__dirname, "../"),
    // 打包模式
    mode: 'development',
    // 入口，可以是字符串、数组、对象
    entry: Entry.config,
    // 出口
    output: { 
        // 路径
        path: path.resolve(__dirname,'../dist/'),
        // 文件名
        filename:'static/js/[name]-bundle.js',
        // publicPath: "http://localhost:8081/"
    },
    // 加载器
    module:{rules: Loader.config},
    // 插件
    plugins:Plugins.config,
    // 服务和热更新
    devServer:Server.config 
}
