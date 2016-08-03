#manta-web

#### Notes
为方便协调工作，建议UI或者后端关于项目的文档以及素材全部传至本仓库的documents文件夹下

# 服务
node > 4.0.0
npm > 3.8.0

# 框架版本
react: 0.14.7

# 使用
## 安装依赖模块
    $ npm install 

## 构建
    $ npm run build

## 本地调试预览
    $ npm run local
http://localhost:8005
    

# 扩展
## 本地服务的IP修改
配置文件：package.json
修改scripts配置，将dev配置后的 --host IP地址修改为本机的IP地址

    $ npm run dev

http://host:8005
```javascript
    "scripts": {
        "build": "./node_modules/.bin/webpack --config webpack/webpack.build.config.js --progress --colors",
        "local": "./node_modules/.bin/webpack-dev-server --config webpack/webpack.dev.config.js --progress --colors --inline --hot"
    }
```

## 本地服务端口号修改
配置文件：webpack/webpack.dev.config.js
修改port值为端口号
```javascript
    devServer: {
        contentBase: './monitor/web',
        devtool: 'eval',
        port: 8005,
        hot: true,
        inline: true
    },
```