import * as Koa from "koa";
import { Db } from "mongodb";

declare module "koa" {
  interface Context {
    db: Db;
    ok();
    ok(payload: string | any);
  }
}
