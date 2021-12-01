# fe-config-loader 1.1.0

前端应用每次只在打包编译时加载一组环境变量，这给前端应用尤其是容器化部署造成了很大的不方便。本插件为前端应用提供了一种在运行时动态加载配置文件的方法，通过挂载config.json文件到容器内部并动态加载它，实现同一镜像部署到不同环境的需求。

目前已支持VUE应用和REACT应用。

## 版本更新记录

### 1.0.5
简化获取配置方式，通过NODE_ENV自动判断获取配置内容的根节点
### 1.1.0
增加生产环境配置加密传输方式。**注意：** 加密配置传输，需要后台反向代理加密脚本，可以参考[nginx配置方式](./nginx)实现方案

## 1. 引用依赖

``` bash
npm install fe-config-loader
```

## 2. 环境变量配置

```
# .env.development文件

# 应用运行模式
NODE_ENV ='development'

############################### VUE ###################################
# 为VUE应用配置环境变量根键
# 非生产模式下有效，读取该根键下的配置变量
# 生产模式下，也就是'NODE_ENV = production'时该环境变量无效，读取根配置变量
# VUE_APP_CONFIG_ROOTKEY为空时，读取根配置变量
VUE_APP_CONFIG_ROOTKEY = "dev"

# 生产模式下，也就是'NODE_ENV = production'且反向代理将配置加密处理时
# 以下环境变量有效，配合设置反向代理加密配置，从1.1.0版本开始支持此功能
# 配置加密盐
VUE_APP_CONFIG_SALT = "tnP8DvkSp6MXtZHuP3ClhRTstakloIg"
# 配置加密迭代次数
VUE_APP_CONFIG_ITER = 16
# 配置加密偏移量
VUE_APP_CONFIG_IV = "PYYNphyM1GS1TXiJFKAtATSevEykrbL6eYh4J4FWEZUYSmdqP7e0Mn5xtXbrBgv8Ip"
#######################################################################


############################## REACT ##################################
# 为REACT应用配置环境变量根键
# 非生产模式下有效，读取该根键下的配置变量
# 生产模式下，也就是'NODE_ENV = production'时该环境变量无效，读取根配置变量
# REACT_APP_CONFIG_ROOTKEY为空时，读取根配置变量
REACT_APP_CONFIG_ROOTKEY = "dev"

# 生产模式下，也就是'NODE_ENV = production'且反向代理将配置加密处理时
# 以下环境变量有效，配合设置反向代理加密配置，从1.1.0版本开始支持此功能
# 配置加密盐
REACT_APP_CONFIG_SALT = "tnP8DvkSp6MXtZHuP3ClhRTstakloIg"
# 配置加密迭代次数
REACT_APP_CONFIG_ITER = 16
# 配置加密偏移量
REACT_APP_CONFIG_IV = "PYYNphyM1GS1TXiJFKAtATSevEykrbL6eYh4J4FWEZUYSmdqP7e0Mn5xtXbrBgv8Ip"
#######################################################################
...
```

## 3. 添加本地配置文件

    1) 动态配置文件目录必须为：public/config.json
    2) 支持单行注释// 和 多行注释/* ... */

``` json
/* public/config.json */
{
    // 非生产模式下，XXX_APP_CONFIG_ROOTKEY = 'dev'时，读取以下配置信息
    "dev": {
        "baseUrl": "http://dev_hostname/api/v1",
        "logLevel": "debug"
    },
    // 非生产模式下，XXX_APP_CONFIG_ROOTKEY = 'sit'时，读取以下配置信息
    "sit": {
        "baseUrl": "http://sit_hostname/api/v1",
        "logLevel": "info"
    },
    // 生产模式或XXX_APP_CONFIG_ROOTKEY变量为空时，读取以下配置信息
    "baseUrl": "http://prod_hostname/api/v1",
    "logLevel": "error"
}
```

## 4. 引用配置
``` javascript
import axios from 'axios'
import configLoader from 'fe-config-loader'

const service = axios.create({
  baseURL: configLoader.get('baseUrl'),
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})
```
