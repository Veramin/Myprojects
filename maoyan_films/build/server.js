const path    = require('path');
exports.config = {
    // 设置服务器访问的基本目录
    contentBase:path.resolve(__dirname,'./dist'), //最好设置成绝对路径
    // 设置服务器的ip地址,可以是localhost
    host:'localhost',
    // 设置端口
    port:8081,
    // 设置自动拉起浏览器
    open:true,
    // 自动刷新
    inline: true,
    // 模块热替换
    hot: true
}