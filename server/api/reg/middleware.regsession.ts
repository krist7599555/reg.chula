import * as fs from "fs";
import { range } from "lodash";
import { initlogin, ocr_tesseract, login } from "./function";
import { createAxiosRegChulaTH } from "./axios.reg";
import { Context } from "koa";
import { resolve } from "path";
import { LOGON_SERVLET, LOGIN_FAIL_SERVLET, LOGOUT_SERVLET } from "./axios.reg";
import { AxiosInstance } from "axios/index.d";

const REG_CHULA_COOKIE = "RegChulaCookie";
const REG_AXIOS = "RegChulaAxiosInstance";

const KEEP_COOKIE_PATH = resolve(__dirname, "reg.cookie.txt");
const keep_cookie = {
  get: () => fs.readFileSync(KEEP_COOKIE_PATH).toString(),
  set: (str: string) => fs.writeFileSync(KEEP_COOKIE_PATH, str)
};

const saveAxiosReg = null;

export default async function regcession(ctx: Context & { axios: AxiosInstance }, next) {
  // CLEAR PREV SESSION
  if (keep_cookie.get()) {
    const prevAxios = createAxiosRegChulaTH(keep_cookie.get());
    await prevAxios(LOGOUT_SERVLET());
    keep_cookie.set("");
  }

  // GET AUTH
  const {
    username = process.env.REG_username,
    password = process.env.REG_password
  } = ctx.request.body;
  ctx.assert(username, 400, "require username");
  ctx.assert(password, 400, "require password");
  ctx.assert(/^\d{10}$/.test(username), 400, "wrong format username");

  // RETRY LOOP
  for (const i in range(6)) {
    // VERIFY CAPTCHA
    const { cookie, captchaURL } = await initlogin(username, password);
    const { text, base64, confidence } = await ocr_tesseract(captchaURL, cookie);
    keep_cookie.set(cookie);

    try {
      // TRY LOGIN IF WORK

      // ? ADD "AXIOS" PROPERTY

      ctx.axios = await login({ username, password, cookie, captcha: text });
      console.log(username, "[login]");

      // GO NEXT
      await next();

      // ! IMPORTANT MUST ALWAYS LOGOUT

      await ctx.axios(LOGOUT_SERVLET());
      console.log(username, "[logout]");

      return; // END
    } catch (err) {
      console.log(username, "[attemp]", err.message);

      // CAPTCHA FAIL => retry
      // ANOTHER FAIL => exit
      if (err.message == "Charecter 4 digit is not match") {
        continue;
      } else if (err.message.includes("ท่านได้เข้าสู่ระบบอยู่")) {
        return ctx.forbidden(err.message);
      } else {
        return ctx.throw(err.message);
      }
    }
  }
  return ctx.send(504, "Gateway Timeout");
}
