// eslint-disable-next-line @typescript-eslint/no-var-requires
const CryptoJS = require('crypto-js');

export const encrypt = (message: string) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(message),
    process.env.REACT_APP_CRYPTO_KEY,
  ).toString();
};

export const decrypt = (message: string) => {
  const bytes = CryptoJS.AES.decrypt(message, process.env.REACT_APP_CRYPTO_KEY);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};
