import SimpleCrypto from "simple-crypto-js";
const crypto = new SimpleCrypto(process.env.PWID);

export default crypto;
export const decrypt = (str: string) => crypto.decrypt(str) as string;
export const encrypt = (str: string) => crypto.encrypt(str) as string;
