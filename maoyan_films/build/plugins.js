// 引入
const webpack = require('webpack');
// 引入插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const htmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
exports.config = [
    // 创建插件实例
        // 分离CSS
        new ExtractTextPlugin('static/css/[name].css'),
        // 压缩css
        new OptimizeCssAssetsPlugin(),
        // 主页
        new htmlWebpackPlugin({
            template:'./src/index.html',
            inject:true,
            chunks:['main','common'],
            filename:'index.html'
        }),
        // 电影页
        new htmlWebpackPlugin({
            template:'./src/pages/films.html',
            inject:true,
            chunks:['films','common'],
            filename:'static/pages/films.html'
        }),
        // 影院页
        new htmlWebpackPlugin({
            template:'./src/pages/cinemas.html',
            inject:true,
            chunks:['cinemas','common'],
            filename:'static/pages/cinemas.html'
        }),
        // 榜单页
        new htmlWebpackPlugin({
            template:'./src/pages/board.html',
            inject:true,
            chunks:['board','common'],
            filename:'static/pages/board.html'
        }),
        // 热点页
        new htmlWebpackPlugin({
            template:'./src/pages/news.html',
            inject:true,
            chunks:['news','common'],
            filename:'static/pages/news.html'
        }),
        // 登录页
        new htmlWebpackPlugin({
            template:'./src/pages/login.html',
            inject:true,
            chunks:['login'],
            filename:'static/pages/login.html'
        }),
        // 注册页
        new htmlWebpackPlugin({
            template:'./src/pages/register.html',
            inject:true,
            chunks:['register'],
            filename:'static/pages/register.html'
        }),
        // 详情页
        new htmlWebpackPlugin({
            template:'./src/pages/details.html',
            inject:true,
            chunks:['details','common'],
            filename:'static/pages/details.html'
        }),
        // 选座页(order)
        new htmlWebpackPlugin({
            template:'./src/pages/order.html',
            inject:true,
            chunks:['order','common'],
            filename:'static/pages/order.html'
        }),
        // 搜索页(query)
        new htmlWebpackPlugin({
            template:'./src/pages/query.html',
            inject:true,
            chunks:['query','common'],
            filename:'static/pages/query.html'
        }),
        // 基本信息页(profile)
        new htmlWebpackPlugin({
            template:'./src/pages/profile.html',
            inject:true,
            chunks:['profile','common'],
            filename:'static/pages/profile.html'
        }),
        // 电影选座页(vote)
        new htmlWebpackPlugin({
            template:'./src/pages/vote.html',
            inject:true,
            chunks:['vote','common'],
            filename:'static/pages/vote.html'
        }),
        // 选座前一页(ballot)
        new htmlWebpackPlugin({
            template:'./src/pages/ballot.html',
            inject:true,
            chunks:['ballot','common'],
            filename:'static/pages/ballot.html'
        }),
        // 支付页(pay)
        new htmlWebpackPlugin({
            template:'./src/pages/pay.html',
            inject:true,
            chunks:['pay','common'],
            filename:'static/pages/pay.html'
        }),
        new htmlWebpackPlugin({
            template:'./src/pages/profile.html',
            inject:true,
            chunks:['profile','common'],
            filename:'static/pages/profile.html'
        }),
        // 模块热替换
        new webpack.HotModuleReplacementPlugin(),
        // 清空文件
        new CleanWebpackPlugin(["../dist"]),
        // 全局引入三方插件
        new webpack.ProvidePlugin({
            // 插件名字："插件路径
            $:"jquery"
        }),
        // 打包静态资源
        new CopyWebpackPlugin([
            {
                from:'./src/json',
                to: './static/json'
            }
        ]),
        new CopyWebpackPlugin([
            {
                from:'./src/plugin',
                to: './static/plugin'
            }
        ]),
        new CopyWebpackPlugin([
            {
                from:'./src/images',
                to: './static/images'
            }
        ])
]