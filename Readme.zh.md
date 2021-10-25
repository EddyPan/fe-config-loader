# fe-config-loader

简体中文 | [English](./Readme.md)

前端应用每次只在打包编译时加载一组环境变量，这给前端应用尤其是容器化部署造成了很大的不方便。本插件为前端应用提供了一种在运行时动态加载配置文件的方法，通过挂载config.json文件到容器内部并动态加载它，实现同一镜像部署到不同环境的需求。

目前已支持VUE应用和REACT应用。

## 1. 引用依赖

``` bash
npm install fe-config-loader
```

## 2. 环境变量配置根键设置

```
# .env.development文件

# 应用运行模式
NODE_ENV ='development'

# 为VUE应用配置环境变量根键
# 非生产模式下有效，读取该根键下的配置变量
# 生产模式下，也就是'NODE_ENV = production'时该环境变量无效，读取根配置变量
# VUE_APP_CONFIG_ROOTKEY为空时，读取根配置变量
VUE_APP_CONFIG_ROOTKEY = "dev"

# 为REACT应用配置环境变量根键
# 非生产模式下有效，读取该根键下的配置变量
# 生产模式下，也就是'NODE_ENV = production'时该环境变量无效，读取根配置变量
# REACT_APP_CONFIG_ROOTKEY为空时，读取根配置变量
REACT_APP_CONFIG_ROOTKEY = "dev"
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
