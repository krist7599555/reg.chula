import SimpleCrypto from "simple-crypto-js";
import { secret } from "@config/crypto";
export default new SimpleCrypto(secret);
