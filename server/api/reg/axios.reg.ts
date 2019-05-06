import * as qs from "qs";
import * as iconv from "iconv-lite";
import * as https from "https";
import axios from "axios";
import { AxiosRequestConfig } from "axios/index.d";

export const REG_BASE_URL = "https://www2.reg.chula.ac.th";

export function createAxiosRegChulaTH(cookie?: string) {
  const axiosRegTH = axios.create({
    baseURL: REG_BASE_URL,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    responseType: "arraybuffer",
    withCredentials: true,
    headers: { Cookie: cookie || "" }
  });
  axiosRegTH.interceptors.response.use(response => {
    if (
      response.config.responseType == "arraybuffer" &&
      !response.headers["content-type"].includes("application/pdf") &&
      !response.config.url.includes("image")
    ) {
      response.data = iconv.decode(response.data, "ISO-8859-11");
    }
    return response;
  });
  return axiosRegTH;
}

export const INIT_LOGON_SERVLET = (): AxiosRequestConfig => ({
  method: "GET",
  url: "/servlet/com.dtm.chula.reg.servlet.InitLogonServlet",
  responseType: "text"
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
  url: "/servlet/com.dtm.chula.reg.servlet.LogOutServlet?language=T",
  responseType: "text"
});

export const CAPTCHA_ARRAY_BUFFER = (url: string): AxiosRequestConfig => ({
  method: "GET",
  url,
  responseType: "arraybuffer"
});

export const CR60_PDF_GRADE_REPORT = (ouid: string): AxiosRequestConfig => ({
  method: "GET",
  url: `/servlet/com.dtm.chula.general.servlet.CR60FileServlet?FormsButton0=Print+All+Grade+Report&studentCode=${ouid}`,
  responseType: "arraybuffer"
});

export const CR54_SERVLET = (): AxiosRequestConfig => ({
  method: "GET",
  url: "/servlet/com.dtm.chula.reg.servlet.CR54Servlet"
});

export const CR60_SERVLET = (): AxiosRequestConfig => ({
  method: "GET",
  url: "/servlet/com.dtm.chula.general.servlet.CR60Servlet"
});
