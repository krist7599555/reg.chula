import * as cheerio from "cheerio";
import { join, map } from "lodash";
import { trimChars } from "lodash/fp";
import * as tesseract from "tesseract.js";
import {
  CAPTCHA_IMAGE,
  createAxiosRegChulaTH,
  INIT_LOGON_SERVLET,
  LOGIN_FAIL_SERVLET,
  LOGIN_SUCCESS_SERVLET,
  LOGON_SERVLET,
  REG_BASE_URL
} from "./regAxios";
import { AxiosInstance } from "axios";

function axios_cookie_parse(cookie: any) {
  try {
    return join(map(cookie, s => s.split(";")[0] + ";"), " ");
  } catch {
    return "";
  }
}

// * INIT_LOGIN

export async function init_login(username: string, password: string) {
  const axiosReg = await createAxiosRegChulaTH();
  const loginPage = await axiosReg(INIT_LOGON_SERVLET());
  return {
    cookie: axios_cookie_parse(loginPage.headers["set-cookie"]),
    captchaURL: cheerio("img#CAPTCHA", loginPage.data)[0].attribs.src.replace("..", REG_BASE_URL)
  };
}

init_login.middleware = function(ctx, next) {
  return init_login(ctx.state.username, ctx.state.password).then(res => {
    ctx.axios = createAxiosRegChulaTH(res.cookie);
    ctx.state.cookie = res.cookie;
    ctx.state.captchaURL = res.captchaURL;
    return next();
  });
};

// * OCR_TESSERACT

export async function ocr_tesseract(imageURL: string, cookie: string, _axios?: AxiosInstance) {
  if (!imageURL.startsWith("http")) throw new Error("captcha URL is not http/https");
  if (!cookie.includes("JSESSIONID=")) throw new Error("cookie not contain JSESSIONID");
  const axiosReg = _axios ? _axios : createAxiosRegChulaTH(cookie);
  const captcha = await axiosReg(CAPTCHA_IMAGE(imageURL));
  const buffer = Buffer.from(captcha.data, "binary");
  const tess = await tesseract.recognize(buffer, { lang: "eng" });
  return {
    text: tess.text.toUpperCase().replace(/\s+|[^A-Z0-9]/g, ""),
    base64: `data:image/png;base64,${buffer.toString("base64")}`,
    confidence: tess.confidence
  };
}

ocr_tesseract.middleware = function(ctx, next) {
  return ocr_tesseract(ctx.state.captchaURL, ctx.state.cookie, ctx.axios).then(res => {
    ctx.state.captcha = res.text;
    return next();
  });
};

// * LOGIN (VALIDIZE TOKEN)

export async function login({ username, password, captcha, cookie }, _axios?: AxiosInstance) {
  const axiosRegTH = _axios ? _axios : createAxiosRegChulaTH(cookie);
  const html: string = await axiosRegTH(LOGON_SERVLET({ username, password, captcha })).then(
    res => res.data
  );
  if (html.includes(LOGIN_SUCCESS_SERVLET().url)) {
    return axiosRegTH;
  } else if (html.includes(LOGIN_FAIL_SERVLET().url)) {
    throw new Error(
      await axiosRegTH(LOGIN_FAIL_SERVLET()).then(res =>
        trimChars('." ')(
          cheerio("FONT[color='#FF0000']", res.data)
            .text()
            .replace("A00010-", "")
            .replace(/\s+/g, " ")
            .trim()
        )
      )
    );
  } else {
    throw new Error("unknow login? not Success & not Fail");
  }
}

login.middleware = function(ctx, next) {
  return login(
    {
      username: ctx.state.username,
      password: ctx.state.password,
      captcha: ctx.state.captcha,
      cookie: ctx.state.cookie
    },
    ctx.axios
  ).then(next);
};
