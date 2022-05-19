import json5 from 'json5'
import crypto from 'crypto'

const SALT = process.env.VUE_APP_CONFIG_SALT || process.env.REACT_APP_CONFIG_SALT || 'tnP8DvkSp6MXtZHuP3ClhRTstakloIg'
const ITER = process.env.VUE_APP_CONFIG_ITER || process.env.REACT_APP_CONFIG_ITER || 16
const IV = process.env.VUE_APP_CONFIG_IV || process.env.REACT_APP_CONFIG_IV || 'PYYNphyM1GS1TXiJFKAtATSevEykrbL6eYh4J4FWEZUYSmdqP7e0Mn5xtXbrBgv8Ip'

let config = {}

const decrypt = (decryptedData, password) => {
  const key = crypto.pbkdf2Sync(password, SALT, ITER, 16, 'sha256')
  let data = Buffer.from(decryptedData, 'base64')
  const authTag = data.slice(data.length - 16)
  data = data.slice(0, data.length - 16)
  const decipher = crypto.createDecipheriv('aes-128-gcm', key, Buffer.from(IV, 'utf-8'))
  decipher.setAuthTag(authTag)

  return decipher.update(data) + decipher.final()
}

// Load configuration files synchronously
const load = _ => {
  const xmlhttp = new XMLHttpRequest()
  xmlhttp.open('GET', `${process.env.BASE_URL || './'}config.json?_t=${new Date().getTime()}`, false)
  xmlhttp.send()
  if (process.env.NODE_ENV === 'production') {
    // on the production mode, read root config
    const { feConfigEncrypted, decryptedData, password, saltkey } = json5.parse(xmlhttp.responseText)
    // decrypt config when feConfigEncrypted is true
    if (feConfigEncrypted) {
      const cfg = decrypt(decryptedData, saltkey || password)
      config = json5.parse(cfg)
    } else {
      config = json5.parse(xmlhttp.responseText)
    }
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
