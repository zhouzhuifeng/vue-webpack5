const path = require("path");
const { CheckerPlugin } = require('awesome-typescript-loader') //awesome-typescript-loader编译ts比ts-loader快
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")// 从js中抽离css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');// 压缩css
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpackbar = require("webpackbar"); // 进度条
const webpack = require("webpack"); // 进度条


module.exports = (env, arg) => {
    console.log(process.env.NODE_ENV, '使用cross-env传参 NODE_ENV=development', arg.mode)
    const isDevelopment = arg.mode === "development";
    const config = {
        mode: arg.mode || 'development',
        //打包文件入口
        entry: "./main.js",
        //打包文件出口
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: isDevelopment ? "[name].js" : "[name].[chunkhash:8].js",
            publicPath: isDevelopment ? '/' : '/assets/'
        },

        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    // 为了确保 JS 的转译应用到 node_modules 的 Vue 单文件组件，你需要通过使用一个排除函数将它们加入白名单
                    exclude: file => (
                        /[\\/]node_modules[\\/]/.test(file) &&
                        !/\.vue\.js/.test(file)
                    ),
                    loader: 'babel-loader'
                },
                {
                    test: /\.tsx?$/,
                    exclude: /[\\/]node_modules[\\/]/,
                    use: [
                        'babel-loader', {
                            loader: 'awesome-typescript-loader',
                            options: { appendTsSuffixTo: [/\.vue$/] }
                        }
                    ]
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        hotReload: true, // 开启热重载
                        extractCSS: true
                    }
                },
                {
                    test: /\.less$/,
                    use: [
                        isDevelopment ? 'style-loader' : {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: (resourcePath, context) => {
                                    // publicPath 是资源相对于上下文的相对路径
                                    // 例如：对于 ./css/admin/main.css publicPath 将会是 ../../
                                    // 而对于 ./css/main.css publicPath 将会是 ../
                                    return path.relative(path.dirname(resourcePath), context) + '/css';
                                }
                            }
                        },
                        'css-loader',
                        'postcss-loader',
                        'less-loader'
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        isDevelopment ? 'style-loader' : {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: (resourcePath, context) => {
                                    // publicPath 是资源相对于上下文的相对路径
                                    // 例如：对于 ./css/admin/main.css publicPath 将会是 ../../
                                    // 而对于 ./css/main.css publicPath 将会是 ../
                                    return path.relative(path.dirname(resourcePath), context) + '/';
                                }
                            }
                        },
                        {
                            loader: 'css-loader',
                            options: { importLoaders: 1 }
                        },
                        'postcss-loader'
                    ]
                },
                // {
                //     test: /\.(png|jpe?g|gif|eot|svg|ttf|woff|woff2)$/i,
                //     use: [
                //         {
                //             loader: 'file-loader',
                //             options: {
                //                 // publicPath: 'assets',
                //                 name(resourcePath, resourceQuery) {
                //                     if (process.env.NODE_ENV === 'development') {
                //                         return '[path][name].[ext]';
                //                     }
                //                     return '[contenthash].[ext]';
                //                 },
                //             }
                //         }
                //     ],
                // },
                {
                    test: /\.(png|jpe?g|gif|eot|svg|ttf|woff|woff2)$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                                name: isDevelopment ? '[path][name].[ext]' : '[contenthash].[ext]'
                            },
                        },
                    ],
                },
                // 因为绝大多数 webpack 的模板类 loader，诸如 pug-loader，会返回一个模板函数而不是一个编译好的 HTML 字符串。所以我们需要使用一个返回原始的 HTML 字符串的 loader，例如 pug-plain-loader
                {
                    test: /\.pug$/,
                    loader: 'pug-plain-loader'
                }
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.vue', '.json'],
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@img': path.resolve(__dirname, './src/assets/imgs')
            },
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CheckerPlugin(),
            // 请确保引入这个插件！
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                path: path.resolve(__dirname, './dist'),
                title: 'myWebpack',
                fileName: 'index.html',
                template: 'index.html',//在public目录下创建一个index.html文件，并作为模板
            }),
        ]
    }
    if (isDevelopment) {
        config.target = 'web'
        config.devtool = 'eval-cheap-module-source-map'
        config.devServer = {
            contentBase: path.join(__dirname, 'dist'),
            port: 8009,
            host: 'localhost',
            overlay: {
                errors: true,  //编译中遇到的错误都会显示到网页中去
            },
            historyApiFallback: true,//处理history 路由本地刷新404
            hot: true,
            inline: true,
        }

    } else {
        config.optimization = {
            minimize: true,
            minimizer: [
                // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
                // `...`
                new CssMinimizerPlugin(),
            ],
            runtimeChunk: 'single',
            splitChunks: {
                // 有效值为all，async和initial。提供all可能会特别强大，因为它意味着即使在异步和非异步块之间也可以共享块
                chunks: 'all',
                maxAsyncRequests: 30,
                minSize: 20000,
                cacheGroups: {
                    // 创建一个commons块，其中包括入口点之间共享的所有代码
                    commons: {
                        name: 'commons',
                        chunks: 'initial',
                        minChunks: 2
                    },
                    //将第三方库(library)（例如 vue,vuex,vue-router）提取到单独的 vendor chunk 文件中
                    vendor: {
                        // test: /[\\/]node_modules[\\/]/,
                        test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                    // styles: {
                    //     name: 'styles',
                    //     test: /\.css$/,
                    //     chunks: 'all',
                    //     enforce: true,
                    // },
                },
            },
        }
        config.plugins.push(
            new MiniCssExtractPlugin({ filename: '[contenthash].css' }),
            new webpackbar() // 打包时美化进度条
        )
    }
    return config
}
