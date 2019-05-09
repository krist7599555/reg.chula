import axios from "axios";
import { AxiosRequestConfig } from "axios/index.d";
import * as https from "https";
import * as iconv from "iconv-lite";
import * as qs from "qs";

export const REG_BASE_URL = "https://www2.reg.chula.ac.th";

export function createAxiosRegChulaTH(cookie?: string) {
  iconv.encodingExists;
  const regChulaAxios = axios.create({
    baseURL: REG_BASE_URL,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    withCredentials: true,
    headers: { Cookie: cookie || "" },
    responseType: "arraybuffer"
  });
  regChulaAxios.interceptors.response.use(response => {
    const rpath: string = response.request.path;
    const ctype: string = response.headers["content-type"];
    const rtype: string = response.config.responseType;
    // if (rpath.includes("CR60FileServlet")) {
    //   console.log("pdf", ctype, rtype, response.headers);
    // }
    if (ctype.includes("html") && ctype.includes("charset=WINDOWS-874") && rtype == "arraybuffer") {
      response.data = iconv.decode(response.data, "iso-8859-11");
    }
    return response;
  });
  // @ts-ignore
  regChulaAxios.setCookie = (cookie: string) => {
    regChulaAxios.defaults.headers.Cookie = cookie;
  };
  return regChulaAxios;
}

export const INIT_LOGON_SERVLET = (): AxiosRequestConfig => ({
  method: "GET",
  url: "/servlet/com.dtm.chula.reg.servlet.InitLogonServlet",
  timeout: 3000
});

export const LOGON_SERVLET = ({ username, password, captcha }): AxiosRequestConfig => ({
  method: "POST",
  url: "/servlet/com.dtm.chula.reg.servlet.LogonServlet",
  data: qs.stringify({
    code: captcha,
    userid: username,
    password: password,
    programsystem: "S",
    language: "T"
  })
});

export const LOGIN_SUCCESS_SERVLET = (): AxiosRequestConfig => ({
  method: "GET",
  url: "/cu/reg/logon/logonSuccessPage.jsp"
});
export const LOGIN_FAIL_SERVLET = (): AxiosRequestConfig => ({
  method: "GET",
  url: "/servlet/com.dtm.chula.reg.servlet.LogonFailServlet?language=T"
});

export const LOGOUT_SERVLET = (): AxiosRequestConfig => ({
  method: "GET",
  url: "/servlet/com.dtm.chula.reg.servlet.LogOutServlet?language=T"
});

export const CAPTCHA_IMAGE = (url: string): AxiosRequestConfig => ({
  method: "GET",
  url,
  responseType: "arraybuffer"
});

export const PDF_GRADE_REPORT = (ouid: string): AxiosRequestConfig => ({
  method: "GET",
  url: `/servlet/com.dtm.chula.general.servlet.CR60FileServlet?FormsButton0=Print+All+Grade+Report&studentCode=${ouid}`,
  responseType: "stream" // important
});

export const CR54_SERVLET = (): AxiosRequestConfig => ({
  method: "GET",
  url: "/servlet/com.dtm.chula.reg.servlet.CR54Servlet"
});

export const CR60_SERVLET = (): AxiosRequestConfig => ({
  method: "GET",
  url: "/servlet/com.dtm.chula.general.servlet.CR60Servlet"
});
