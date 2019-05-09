import { AxiosInstance } from "axios/index.d";
import * as fs from "fs";
import { range } from "lodash";
import { resolve } from "path";
import { createAxiosRegChulaTH, LOGOUT_SERVLET } from "./regAxios";
import { init_login, login, ocr_tesseract } from "./regApi";

const KEEP_COOKIE_PATH = resolve(__dirname, "./.cache/reg.cookie.txt");
const keep_cookie = {
  get: () => fs.readFileSync(KEEP_COOKIE_PATH).toString(),
  set: (str: string) => fs.writeFileSync(KEEP_COOKIE_PATH, str)
};

const saveAxiosReg = null;
async function clearOldSession() {
  try {
    if (keep_cookie.get()) {
      const prevAxios = createAxiosRegChulaTH(keep_cookie.get());
      await prevAxios(LOGOUT_SERVLET());
      keep_cookie.set("");
      return true;
    }
  } catch {
    return false;
  }
}

export const regSession = (admin?: "admin" | null) => async (ctx: Context, next) => {
  // CLEAR PREV SESSION
  await clearOldSession();

  // GET AUTH
  const { username, password } =
    admin == "admin"
      ? { username: process.env.REG_username, password: process.env.REG_password }
      : await ctx.profile();
  console.log(username, password);
  ctx.assert(username, 400, "require username");
  ctx.assert(password, 400, "require password");
  ctx.assert(/^\d{10}$/.test(username), 400, "wrong format username");

  // RETRY LOOP
  for (const i in range(6)) {
    // VERIFY CAPTCHA
    const { cookie, captchaURL } = await init_login(username, password);
    const { text, base64, confidence } = await ocr_tesseract(captchaURL, cookie);
    keep_cookie.set(cookie);

    try {
      // TRY LOGIN IF WORK
      // ? ADD "AXIOS" PROPERTY
      ctx.axios = await login({ username, password, cookie, captcha: text });
      ctx.state.ouid = username;
      ctx.state.cookie = cookie;
      ctx.state.username = username;
      ctx.state.password = password;
      console.log(username, "[login]");

      // CALL NEXT
      console.log(username, "[next]");
      await next();
      console.log(username, "[back]");

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
        return ctx.throw(err);
      }
    }
  }
  return ctx.throw(504, "Gateway Timeout");
};
