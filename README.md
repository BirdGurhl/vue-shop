# vue-shop

### 项目技术栈
```
​ Vue2 + Element UI + Vue-Router + Axios + ES6 + Css 等
```
### 项目运行环境
```
​ Node.js + MySQL
```

## 安装依赖
```
npm install
```
## 后台数据库
```
后台项目：./msql/vue_api_server.rar 

sql脚本：vue_api_server/db/mydb.sql
```
```
默认配置（可在 vue_api_server/config/default.json 中修改）：
    	"database" : "mydb",
		"user" : "root",
		"password" : "123456",
		"port" : 3306
```
### 后台运行
```
1、解压./msql/vue_api_server.rar 
2、在vue_api_server/config/default.json中修改数据库默认配置（如数据库用户名与密码）
3、创建数据库mydb（默认）
4、在mydb中运行mydb.sql脚本导入数据库表
5、安装后台项目依赖：在已解压的 vue_api_server 打开终端运行 npm install 安装项目依赖
6、运行后台项目：在 vue_api_server 中打开终端运行 node ./app.js 

```
### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### 部分功能运行演示（图片体积较大请稍候片刻...）

角色列表：
<img src="https://github.com/BirdGurhl/vue-shop/blob/master/%E6%88%AA%E5%9B%BE/%E8%A7%92%E8%89%B2%E5%88%97%E8%A1%A8.gif" alt="角色列表" width="800px">

商品列表：
<img src="https://github.com/BirdGurhl/vue-shop/blob/master/%E6%88%AA%E5%9B%BE/%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8.gif" alt="商品列表" width="800px">

分类参数：
<img src="https://github.com/BirdGurhl/vue-shop/blob/master/%E6%88%AA%E5%9B%BE/%E5%88%86%E7%B1%BB%E5%8F%82%E6%95%B0.gif" alt="分类参数" width="800px">


