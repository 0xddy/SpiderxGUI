# 数据管理面板

### 1、配置

- ../src/config.js
```ts
export default {
    /**
     * 对接后端服务地址
     * 后端默认端口 8090
     */
    baseUrl: "http://127.0.0.1:8090",
    /**
     * 封面图片地址
     * 后端默认的图片存储目录是 当前目录/thumb/
     * 可以使用 Nginx 托管该路径对外提供文件
     */
    thumbBaseUrl: "http://spiderx.novel4j.com",
    /**
     * 后端鉴权
     * 默认用户名密码：bookstore
     * 配置文件：application.properties
     */
    auth: {
        username: 'bookstore',
        password: 'bookstore'
    }
}
```

### 2、运行项目

> 前提需要安装NodeJs环境

```shell
git clone git@github.com:0xddy/SpiderxGUI.git
cd ./SpiderxGUI
npm install
```

#### Debug 启动
```
npm run serve
```

#### 打包构建项目
```shell
npm run build
```

![](https://github.com/0xddy/SpiderxGUI/blob/master/screenshot/QQ截图20221019150345.png)
