##### 概念

本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

##### 安装 webpack webpack-cli

全局安装

``` javascript
npm install webpack webpack - cli - g
```

项目内容安装

``` javascript
npm install webpack webpack - cli - D
```

##### 创建 app 项目

app 文件夹目录如下：

``` javascript
index.html;
index.js;
run1.js;
```

index.html：

``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="./dist/main.js"></script>
</head>

<body></body>

</html>
```

index.js:

``` javascript
document.write(require("./run1.js"));
```

run1.js:

``` javascript
module.exports = "It works from run1.js.";
```

接下来我们使用 webpack 命令来打包：

``` javascript
webpack. / index.js - o dist
```

打包成功后的目录结构:

``` javascript
│
index.html│ index.js│ run1.js│└─ dist
main.js
```

`-o` 是 `--output-path` ， `entry` 入口默认值为 `./src`  `output` 默认值为 `./dist` ，打包后的文件名默认为 `main.js`

##### 配置文件的方式打包

`webpack` 默认会去读取 `webpack.config.js` 当配置文件，执行 `npm`  `init` 生成 `package.json` , 调整文件的目录结构如下：

``` javascript
│
index.html│ package.json│ webpack.config.js│ zz.md│└─ src
index.js
run1.js
```

`package.json` 里 `scripts` 增加一个配置项 `build` ：

``` javascript
{
    "name": "app",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "webpack"
    },
    "author": "",
    "license": "ISC"
}
```

`webpack.config.js` 配置如下：

``` javascript
const path = require("path");
module.exports = {
    //打包文件入口
    entry: "./src/index.js",

    //打包文件出口
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js",
    },
};
```

执行 `npm`  `run`  `build` 打包：

``` javascript
│
index.html│ package.json│ webpack.config.js│ zz.md│├─ dist│ main.js│└─ src
index.js
run1.js
```

##### 输出文件的名配置

1. `filename: [name].js` `name` 最终与入口的名称一致

2. 带`hash` 动态 `name` `hash`如：`filename: [name].[hash].js`, 有 3 种

* `chunkhash` 按需加载块内容的 `hash` ，根据 `chunk` 自身的内容计算而来,      `[name].[chunkhash:8].js` ; 

* `contenthash` 是在提取 `css` 文件时根据内容计算而来的 `hash`结合 `ExtractTextWebpackPlugin` 插件使用

* `hash` 长度 默认 20 ，可自定: `[name].[hash:8]` 、 `[name].[chunkhash:16]`

##### mode

可设值为 `development` ， `production` ， `none`

* `development` : 开发模式，打包的代码不会被压缩，开启代码调试

  + 会将 `process.env.NODE_ENV` 的值设为 `development`。启用 `NamedChunksPlugin` 和 `NamedModulesPlugin。`

* `production` : 生产模式，则正好反之。
  + 会将 `process.env.NODE_ENV` 的值设为 `production`。启用 `FlagDependencyUsagePlugin`,      `FlagIncludedChunksPlugin`,      `ModuleConcatenationPlugin`,      `NoEmitOnErrorsPlugin`,      `OccurrenceOrderPlugin`,      `SideEffectsFlagPlugin` 和 `UglifyJsPlugin`

##### devtool

控制是否生成，以及如何生成 `source map` 文件，开发环境下更有利于定位问题，默认 `false` 当然它的开启，也会影响编译的速度，所以生产环境一定一定记得关闭

推荐使用 `devtool` : `cheap-module-source-map`

##### resolve 配置模块解析

`extensions` ：自动解析确定的扩展, 省去你引入组件时写后缀的麻烦
`alias` ：别名，非常重要的一个配置，它可以配置一些短路径
`modules` ： `webpack` 解析模块时应该搜索的目录，

如：

``` javascript
 resolve: {
     extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.json', '.css'],
     alias: {
         @src: path.resolve(__dirname, '../src'),
         @components: path.resolve(__dirname, '../src/components'),
         @utils: path.resolve(__dirname, '../src/utils'),
     },
     modules: ['node_modules'],
 },
```

##### module.rules 编译规则

`rules` ：也就是之前的 loaders

`test` ： 正则表达式，匹配编译的文件

`exclude` ：排除特定条件，如通常会写 node_modules ，即把某些目录 / 文件 过滤掉

`include` ：它正好与 exclude 相反

`use -loader` ：必须要有它，它相当于是一个 test 匹配到的文件对应的解析器， `babel-loader` 、 `style-loader` 、 `sass-loader` 、 `url-loader` 等等

`use - options` ：它与 `loader` 配合使用，可以是一个字符串或对象，它的配置可以直接简写在 `loader` 内一起，它下面还有 `presets` 、 `plugins` 等属性

``` javascript
const path = require("path");
const {
    CheckerPlugin
} = require("awesome-typescript-loader"); //awesome-typescript-loader编译ts比ts-loader快
module.exports = {
    module: {
        rules: [{
                // 命中 JavaScript 文件
                test: /\.js$/,
                use: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: "awesome-typescript-loader",
                exclude: /node_modules/,
            },
            {
                // 命中 SCSS 文件
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
                // 排除 node_modules 目录下的文件
                exclude: path.resolve(__dirname, "node_modules"),
            },
            {
                // 对非文本文件采用 file-loader 加载
                test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
                use: ["file-loader"],
            },
        ],
    },
    plugins: [new CheckerPlugin()],
};
```

##### postcss.config.js

``` javascript
module.exports = {
    plugins: [
        require("autoprefixer"), //优化的过程通过一系列的组件进行优化,此次采用的是autoprefixer
    ],
};
```

##### babel

`babel.config.json` 或 `babelrc.json` ， `babel`  `v7.8.0` 或更高版本用 `.json` , 旧版的用 `babel.config.js` ，出于兼容性原因， `.babelrc` 是的别名 `.babelrc.json`

``` javascript
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage", //内置了polyfill,设置值为usage时遇到需要编译的es6按需加载需要编译的处理模块，无需安装@babel/polyfill(作废了)
                "corejs": "3" // 指定corejs版本（根据core-js安装的版本）
            }
        ],
        "@babel/preset-typescript"
    ],
    "plugins": ["@babel/plugin-transform-runtime"]
}
```

##### tsconfig

``` json
{
  "compilerOptions": {
    "outDir": "./dist", // 这块写不写都可以，webpack.config.js里面已经配置了output
    "module": "es6", // 指的是用的es module的引入方式
    "target": "es5", // 指的是打包成es5代码
    "allowJs": true // 允许tsx引入js文件
  }
}
```

##### plugins 插件

``` javascript
var webpack = require("webpack");
// 导入非 webpack 自带默认插件
var DashboardPlugin = require("webpack-dashboard/plugin");

// 在配置中添加插件
module.exports = {
    //...
    plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        // 编译时(compile time)插件
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": '"production"',
        }),
        // webpack-dev-server 强化插件
        new DashboardPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
};
```

##### 常用的 loader

es6、ts 编译： `babel-loader` 、 `awesome-typescript-loader`

css 样式处理： `css-loader` 、 `postcss-loader` 、 `sass-loader` 、
`less-loader` 、 `style-loader`

图片 /svg/html 等的处理： `file-loader` 、 `url-loader` 、 `html-loader`

##### 常用插件 plugins

自动引入打包后的相关 js： `html-webpack-plugin`

压缩 js： `uglifyjs-webpack-plugin`

压缩 css： `mini-css-extract-plugin`

热更新： `new webpack.HotModuleReplacementPlugin`

全局变量定义： `ProvidePlugin`

清空构建的 dist 文件夹： `clean-webpack-plugin`

 `PreloadWebpackPlugin`

##### webpack-dev-server

``` javascript
devServer: {
    //告诉服务器从哪里提供内容。这只有在您想要提供静态文件时才需要。例如图片
    contentBase: path.join(__dirname, 'dist'),
    // contentBase: false,
    //告诉服务器观看由devServer.contentBase选项提供的文件，文件更改将触发整个		页面重新加载。
    watchContentBase: true,
    //随所有内容启用gzip压缩
    compress: true,
    port: 9997,
    host: '0.0.0.0',
    //这个是使用热更新的标志，然后并不提供热更新功能，需要引入HotModuleReplacementPlugin
    hot: true,
    //在构建失败的情况下，启用热模块替换（请参阅devServer.hot）而不刷新页面作		为回退。
    hotOnly: true,
    //devtool控制台显示信息
    clientLogLevel: 'none', //none, info, (warning,error 一直有）
    //延迟编译，对于异步模块，只有在请求时才会编译，在生产中不需要
    lazy: true,
    filename: "bundle.js",
    //为所有请求添加请求头
    headers: {
        "X-Custom-Foo": "bar"
    },
    //使用HTML5 History API时，系统可能会发送index.html网页来取代404回应
    historyApiFallback: true,
    https: true, //使用https协议
    //在开发服务器的两种不同模式之间切换(--inline, --iframe)。默认情况下，将使用内联模式启用应用程序。这意味着一个脚本将插入到您的包中以处理实时重新加载，并且构建消息将显示在浏览器控制台中。
    inline: true,
    //隐藏webpack打包时的信息
    noInfo: true,
    // 请求到 /api/users 现在会被代理到请求 http://localhost:3000/users
    proxy: {
        "/api": {
            target: "http://localhost:3000",
            pathRewrite: {
                "^/api": ""
            },
            secure: false
        }

    },
    //也是静态文件的目录， 相当于 output.publicPath
    publicPath: "/assets/",
    //启用安静功能后，除了初始启动信息之外的任何内容都将写入控制台。这也意味		着来自webpack的错误或警告不可见。
    quiet: true
}
```

##### 常用命令行

`--watch` ：监听文件变动并自动打包

`--progress` ： 编译的输出内容带有进度

`--colors` ： 编译的输出内容带有颜色

`--open` ：在浏览器中自动打开网页

`-p` ： 压缩混淆脚本

`-d` ：生成 map 映射文件，告知哪些模块被最终打包到哪里了

`--display-error-details` ： 打印错误详情

`--display-modules` ：打包模块

`--display-reasons` ：打包原因

##### webpack5 遇到的坑

| 报错项             | 原因                           | 解决方式                                                              |
| :----------------- | :----------------------------- | :-------------------------------------------------------------------- |
| webpack-dev-server | 启动报错                       | 命令行 webpack-dev-server 变为 webpack serve                          |
| hot: true          | 热更新无效                     | 设置 target: 'web'                                                    |
| vue-style-loader   | style 中的样式无效（未知原因） | 改用 style-loader                                                     |
| img src            | 图片不能显示                   | file-loader 不用与 url-loader 同时使用，url-loader 封装了 file-loader |
| postcss-loader     | postcss-loader  报错，需要配合autoprefixer8使用                   | 安装autoprefixer@8版本 |
| publicPath    | 打包时未配置publicPath报错，必须设置                   | 根据实际设置一个这里设置'./' |
