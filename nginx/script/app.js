import fs from 'fs';

let config;
try {
  config = fs.readFileSync(`/usr/share/nginx/html/config.json`);
} catch (e) {
  config = {};
}

// 加载加密配置
let cryptoCfg;
try {
  cryptoCfg = JSON.parse(fs.readFileSync('/opt/config/crypto.json'));
} catch (e) {
  cryptoCfg = {}
}

// 密钥加盐、迭代次数、偏移量
const SALT = cryptoCfg.salt || 'tnP8DvkSp6MXtZHuP3ClhRTstakloIg';
const ITER = cryptoCfg.iter || 16;
const IV = cryptoCfg.iv || 'PYYNphyM1GS1TXiJFKAtATSevEykrbL6eYh4J4FWEZUYSmdqP7e0Mn5xtXbrBgv8Ip';

async function generateKey(password) {
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);

  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(SALT), iterations: ITER },
    keyMaterial,
    { name: 'AES-GCM', length: 128 },
    false,
    ['encrypt']
  );
}

async function encrypt(req) {
  const ts = new Date().getTime();
  const key = await generateKey(ts);
  const aesParams = {
    name: 'AES-GCM',
    iv: new TextEncoder().encode(IV)
  };

  const decrpted = await crypto.subtle.encrypt(aesParams, key, config);
  const result = {
    ts: `${ts}`,
    cfg: Buffer.from(decrpted).toString('base64')
  }
  req.headersOut['Content-Type'] = 'application/json';
  req.return(200, JSON.stringify(result));
}

export default { encrypt };