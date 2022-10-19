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