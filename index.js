import json5 from 'json5'

let config = {}

// Load configuration files synchronously
const load = _ => {
  const xmlhttp = new XMLHttpRequest()
  xmlhttp.open('GET', `${process.env.BASE_URL||process.env.PUBLIC_URL}config.json?_t=${new Date().getTime()}`, false)
  xmlhttp.send()
  if (process.env.NODE_ENV === 'production') {
    // on the production mode, read root config
    config = json5.parse(xmlhttp.responseText)
  } else if (process.env.VUE_APP_CONFIG_ROOTKEY) {
    // VUE application: on the non-producation mode，has VUE_APP_CONFIG_ROOTKEY environment variable，read the configurations under process.env.VUE_APP_CONFIG_ROOTKEY
    config = json5.parse(xmlhttp.responseText)[process.env.VUE_APP_CONFIG_ROOTKEY]
  } else if (process.env.REACT_APP_CONFIG_ROOTKEY) {
    // REACT application: on the non-producation mode，has REACT_APP_CONFIG_ROOTKEY environment variable，read the configurations under process.env.REACT_APP_CONFIG_ROOTKEY
    config = json5.parse(xmlhttp.responseText)[process.env.REACT_APP_CONFIG_ROOTKEY]
  } else {
    // without VUE_APP_CONFIG_ROOTKEY and REACT_APP_CONFIG_ROOTKEY environment variables, read root config
    config = json5.parse(xmlhttp.responseText)
  }

  if (!config) {
    // if load configuration error, reset it to be an empty object
    config = {}
  }
}

// get a configuration by key
const get = (key) => {
  if (Object.keys(config).length === 0) {
    load()
  }
  return config[key]
}

export default { get }
