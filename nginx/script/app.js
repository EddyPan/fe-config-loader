const fs = require('fs');
const config = fs.readFileSync(`/usr/share/nginx/html/config.json`);

// 密钥加盐、迭代次数、偏移量
const SALT = 'tnP8DvkSp6MXtZHuP3ClhRTstakloIg';
const ITER = 16;
const IV = 'PYYNphyM1GS1TXiJFKAtATSevEykrbL6eYh4J4FWEZUYSmdqP7e0Mn5xtXbrBgv8Ip';

const encoder = new TextEncoder();

if (typeof crypto == 'undefined') {
  crypto = require('crypto').webcrypto;
}

function generatePassword() {
  let arr = crypto.getRandomValues(new Uint8Array(16));
  return 'PWD' + arr.map(dec => {
    return ('0' + dec.toString(16)).substr(-2)
  }).join('');
}

async function buildKey(password) {
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
  const password = generatePassword();
  const key = await buildKey(password);
  const aesParams = {
    name: 'AES-GCM',
    iv: encoder.encode(IV)
  };

  const decrpted = await crypto.subtle.encrypt(aesParams, key, config);
  const result = {
    feConfigEncrypted: true,
    password,
    decryptedData: Buffer.from(decrpted).toString('base64')
  }

  req.headersOut['Content-Type'] = 'application/json;charset=UTF-8';
  req.return(200, JSON.stringify(result));
}

export default { encrypt };