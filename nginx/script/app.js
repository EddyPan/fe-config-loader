const fs = require('fs');
const config = fs.readFileSync(`/usr/share/nginx/html/config.json`);

// 加载加密配置
let cryptoCfg = {}
if (fs.existsSync('/opt/config/crypto.json')) cryptoCfg = require('/opt/config/crypto.json')

// 密钥加盐、迭代次数、偏移量
const SALT = cryptoCfg.salt || 'tnP8DvkSp6MXtZHuP3ClhRTstakloIg';
const ITER = cryptoCfg.iter || 16;
const IV = cryptoCfg.iv || 'PYYNphyM1GS1TXiJFKAtATSevEykrbL6eYh4J4FWEZUYSmdqP7e0Mn5xtXbrBgv8Ip';

const encoder = new TextEncoder();

if (typeof crypto == 'undefined') {
  crypto = require('crypto').webcrypto;
}

function generatePwd() {
  let arr = crypto.getRandomValues(new Uint8Array(6));
  let pwd = "";
  arr.forEach(dec => {
    let str = '00' + dec.toString(16)
    pwd += str.substring(str.length - 2, str.length)
  })
  return pwd.toUpperCase();
}

async function generateKey(password) {
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);

  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt: encoder.encode(SALT), iterations: ITER },
    keyMaterial,
    { name: 'AES-GCM', length: 128, },
    false,
    ['encrypt']
  );
}

async function encrypt(req) {
  const rdmnum = generatePwd();
  const key = await generateKey(rdmnum);
  const aesParams = {
    name: 'AES-GCM',
    iv: encoder.encode(IV)
  };

  const decrpted = await crypto.subtle.encrypt(aesParams, key, config);
  const result = {
    feConfigEncrypted: true,
    rdmnum,
    decryptedData: Buffer.from(decrpted).toString('base64')
  }

  req.headersOut['Content-Type'] = 'application/json;charset=UTF-8';
  req.return(200, JSON.stringify(result));
}

export default { encrypt };