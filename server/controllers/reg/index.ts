import * as compose from "koa-compose";
import grpdf from "./cpdf";
import * as _cr54 from "./cr54";
import { regSession, regSession_logout, regSession_cookie } from "./regSession";

export const cr54 = compose([regSession(), _cr54.middleware()]);
export const pdf = compose([regSession("admin"), grpdf.middleware("pdf")]);
export const json = compose([regSession("admin"), grpdf.middleware("json")]);
export const json_offline = compose([grpdf.middleware_offline()]);
export const multi = compose([regSession("admin"), grpdf.middleware_multiscape()]);
export const adminLogout = compose([regSession_logout()]);
export const adminCookie = compose([regSession_cookie()]);
