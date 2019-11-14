
# cvtspweb 开启软连接 本地调试

#### 项目clone之后

#### 进入cvtspweb 打开终端

- npm link

#### 创建一个软连接，并保存到目录C:\Users\用户名\AppData\Roaming\npm\node_modules下面

### 进去自己的vue项目

- npm link tsp_components

#### 这就将这个公共的项目通过软连接的方式引入到项目里面来了

### 自己项目中配置  main.js
- import tsp_components from 'tsp_components';  
- Vue.use(tsp_components);

#### 这时修改cvtspweb项目下面的任意代码都会实时生效，不用打包，也不用重启

##### npm地址：https://www.npmjs.com/package/tsp_components
##### 账号: monstergao,zhangchangyu

