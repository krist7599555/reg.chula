import * as Koa from "koa";
import { Db } from "mongodb";

declare module "koa" {
  interface Context {
    // https://www.npmjs.com/package/koa-mongo
    db: Db;

    // https://www.npmjs.com/package/koa-respond
    ok(body: any): Context; - HTTP 200
    created(body: any): Context; - HTTP 201
    noContent(body: any): Context; - HTTP 204 [always sends an empty response!]
    badRequest(body: any): Context; - HTTP 400
    unauthorized(body: any): Context; - HTTP 401
    forbidden(body: any): Context; - HTTP 403
    notFound(body: any): Context; - HTTP 404
    internalServerError(body: any): Context; - HTTP 500
  }
}
