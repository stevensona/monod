import sjcl from 'sjcl';


export const Errors = {
  NOT_FOUND: 'not_found',
  SERVER_UNREACHABLE: 'server_unreachable',
  DECRYPTION_FAILED: 'decryption_failed',
};

export function encrypt(content, secret) {
  return sjcl.encrypt(secret, content, { ks: 256 });
}

export function decrypt(content, secret) {
  let decryptedContent;

  try {
    decryptedContent = sjcl.decrypt(secret, content);
  } catch (e) {
    return null;
  }

  return decryptedContent;
}

export function newSecret() {
  return sjcl.codec.base64.fromBits(sjcl.random.randomWords(8, 10), 0);
}
