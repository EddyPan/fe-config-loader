# fe-config-loader

English | [简体中文](./Readme.zh.md)

Front-end application only can load one environment configration at build time. It's really very inconvenient especially for container deployment. This package provides a kind of method to loading configutaion at runtime. You can mount the conif.json file and load it dynamically. Implement the requirements of deploying the same image to different environments.

Now we can support VUE and REACT application.

## 1. install the plugin

``` bash
npm install fe-config-loader
```

## 2. set root-key of environment variables

```
# .env.development file

# application env mode
NODE_ENV ='development'

# set the root-key of environment variables for VUE application
# rook-key is only effective on non-production mode
# on production mode which means when 'NODE_ENV = production', will read root configuration
# when VUE_APP_CONFIG_ROOTKEY is undefined, will read root configuration
VUE_APP_CONFIG_ROOTKEY = "dev"

# set the root-key of environment variables for REACT application
# rook-key is only effective on non-production mode
# on production mode which means when 'NODE_ENV = production', will read root configuration
# when REACT_APP_CONFIG_ROOTKEY is undefined, will read root configuration
REACT_APP_CONFIG_ROOTKEY = "dev"
...
```

## 3. add config.json file

    1) config.json file path should be 'public/config.json'
    2) support single-line comments // and multiline comments /* ... */

``` json
/** 
 * config file
 * public/config.json 
**/
{
    // on non-production mode，when XXX_APP_CONFIG_ROOTKEY = 'dev'，read the following configurations
    "dev": {
        "baseUrl": "http://dev_hostname/api/v1",
        "logLevel": "debug"
    },
    // on non-production mode，when XXX_APP_CONFIG_ROOTKEY = 'sit'，read the following configurations
    "sit": {
        "baseUrl": "http://sit_hostname/api/v1",
        "logLevel": "info"
    },
    // on production mode，when XXX_APP_CONFIG_ROOTKEY = 'sit'，read the following configurations (root configuration)
    "baseUrl": "http://prod_hostname/api/v1",
    "logLevel": "error"
}
```

## 4. import fe-confg-loader
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
