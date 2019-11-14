# cvtspweb
#### 项目clone之后

#### 进入cvtspweb 打开终端

- npm link

#### 创建一个软连接，并保存到目录C:\Users\用户名\AppData\Roaming\npm\node_modules下面

### 进去自己的vue项目

- npm link cvtspweb

#### 这就将这个公共的项目通过软连接的方式引入到项目里面来了

### 自己项目中配置  main.js
- import cvtspweb from 'cvtspweb';  
- Vue.use(cvtspweb);

#### 这时修改cvtspweb项目下面的任意代码都会实时生效，不用打包，也不用重启

 