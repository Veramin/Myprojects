// 引入插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
exports.config = [
    // ES6 -> ES5
    {
        test:/\.js$/,
        exclude:/node_modules/,
        use:{
            loader:'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }
    },
    // 处理less
    {
        test: /\.less/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                'css-loader', 
                {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'postcss',
                        plugins: [
                            require('autoprefixer')({
                                browsers: ["last 2 versions"]
                            }),
                        ]
                    }
                },
                'less-loader'
            ]
        })
    },
    // 处理图片
    {
        test: /\.(png|jpg|jpeg|gif)$/,
        exclude: /node_modules/,
        use: {
            loader: "url-loader",
            options: {
                limit: "1024",
                name: "[name]-[hash].[ext]",
                outputPath: "static/images/"
            }
        }
   },
    //处理html中的图片
    {
        test: /\.html/,
        exclude: /node_modules/,
        loader: 'html-loader'
    }
]
