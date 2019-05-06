import SimpleCrypto from "simple-crypto-js";
const crypto = new SimpleCrypto(process.env.PWID);

export default crypto;
export const decrypt = str => crypto.decrypt(str);
export const encrypt = str => crypto.encrypt(str);
