import JSEncrypt from 'jsencrypt';

let cachedPublicKey: string | null = null;
let keyExpiresAt: number = 0;

/** 设置公钥缓存 */
export function setPublicKey(publicKey: string, expiresAt: number) {
  cachedPublicKey = publicKey;
  keyExpiresAt = expiresAt;
}

/** 获取缓存的公钥 */
export function getCachedPublicKey(): string | null {
  // 检查是否过期（提前 30 秒过期）
  if (cachedPublicKey && Date.now() < keyExpiresAt - 30000) {
    return cachedPublicKey;
  }
  return null;
}

/** 清除公钥缓存 */
export function clearPublicKeyCache() {
  cachedPublicKey = null;
  keyExpiresAt = 0;
}

/** RSA 加密 */
export function encryptWithRSA(publicKey: string, text: string): string {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);

  const encrypted = encrypt.encrypt(text);

  if (!encrypted) {
    throw new Error('RSA 加密失败');
  }

  return encrypted;
}
