import * as compose from "koa-compose";
import grpdf from "./cpdf";
import * as _cr54 from "./cr54";
import { regSession } from "./regSession";

export const cr54 = compose([regSession(), _cr54.middleware()]);
export const pdf = compose([regSession("admin"), grpdf.middleware("pdf")]);
export const json = compose([regSession("admin"), grpdf.middleware("json")]);
export const multi = compose([regSession("admin"), grpdf.middleware_multiscape()]);
