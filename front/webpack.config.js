const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        login: './src/login.ts',//실행  시작점
        'logined/post':  './src/logined/post.ts',
        'logined/mainview' :'./src/logined/mainview.ts',
        signin:'./src/signin.ts',
        'logined/takepost':'./src/logined/takepost.ts',
        'logined/watchview':'./src/logined/watchview.ts',
        'logined/admin' : './src/logined/admin.ts',
        'logined/client' : './src/logined/client.ts',
        'logined/user' : './src/logined/user.ts'
    },
    devtool: 'inline-source-map',
    mode:'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: [/node_modules/],
            }, {
                test: /\.css$/,
                use:["style-loader", "css-loader"]
            }
        ],
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),//아웃풋
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/login.html',
            filename: './login.html',
            chunks:['login']
        }),
        new HtmlWebpackPlugin({
            template: './src/logined/post.html',
            filename: './logined/post.html',
            chunks:['logined/post']
        }),
        new HtmlWebpackPlugin({
            template:'./src/logined/mainview.html',
            filename:'./logined/mainview.html',
            chunks:['logined/mainview']
        }),
        new HtmlWebpackPlugin({
            template:'./src/signin.html',
            filename:'./signin.html',
            chunks:['signin']
        }),
        new HtmlWebpackPlugin({
            template:'./src/logined/takepost.html',
            filename:'./logined/takepost.html',
            chunks:['logined/takepost']
        }),
        new HtmlWebpackPlugin({
            template:'./src/logined/watchview.html',
            filename:'./logined/watchview.html',
            chunks:['logined/watchview']
        }),
        new HtmlWebpackPlugin({
            template:'./src/logined/client.html',
            filename:'./logined/client.html',
            chunks:['logined/client']
        }),
        new HtmlWebpackPlugin({
            template : './src/logined/admin.html',
            filename : './logined/admin.html',
            chunks:['logined/admin']
        }),
        new HtmlWebpackPlugin({
            template : './src/logined/user.html',
            filename: './logined/user.html',
            chunks : ['logined/user']
        })

    ],
    devServer:{
        contentBase:`${__dirname}/dist`,
        inline:true,
        hot:true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:4000',
                changeOrigin: true,
                secure: false
            },
            '/socket.io' : {
                target: 'http://127.0.0.1:4000',
                ws: true,
                changeOrigin: true,
                secure: false
            }
        },
        host: '127.0.0.1',
        port: 4500
    },
    cache: {
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, '.webpack_cache')
    },
};