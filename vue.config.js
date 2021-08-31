const path = require('path')

module.exports = {
  // 配置 tomcat 打包问题
  // publicPath: process.env.NODE_ENV === "test" ? "/exchange" : "/",
	lintOnSave: false,
  configureWebpack: {
    resolve: {
      alias: {
        "assets": path.resolve("src/assets"),
        "@": path.resolve("src")
      },
    }
  }
}
