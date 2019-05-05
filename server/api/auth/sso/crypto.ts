import SimpleCrypto from "simple-crypto-js";
const crypto = new SimpleCrypto(process.env.PWID);

export default crypto;

// @ts-ignore
export const decrypt = str => crypto.decrypt(sty);
// @ts-ignore
export const encrypt = str => crypto.encrypt(sty);
