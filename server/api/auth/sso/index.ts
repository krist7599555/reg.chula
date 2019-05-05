import * as Router from "koa-router";
import axios from "axios";
import { path } from "lodash/fp";
import { encrypt } from "./crypto";
import * as _ from "lodash";
const router = new Router();

import * as faculty from "./faculty.json";
import { sso_login, sso_validate } from "./function";
router
  .prefix("/sso")
  .get("/", ctx => (ctx.body = "SSO"))
  .get("/login", ctx => (ctx.body = "NOT ALLOW GET"))
  .post("/login", async ctx => {
    const { username, password } = ctx.request.body;
    if (process.env.NODE_ENV != "production") {
      const fnd = await ctx.db.collection("user").findOne({ ouid: username });
      if (fnd) {
        return ctx.ok(fnd);
      }
    }

    const { type, content, ticket } = await sso_login(username, password);
    if (type == "error") {
      return ctx.badRequest(content || "can not verify");
    }
    const user = await sso_validate(ticket);
    await ctx.db
      .collection("user")
      .updateOne(
        { ouid: user.ouid },
        { $set: _.assign(user, { pwid: encrypt(password) }) },
        { upsert: true }
      );
    ctx.cookies.set("ticket", ticket, { overwrite: true, maxAge: 1000 * 60 * 60 * 24 });
  })
  .get("/profile", async ctx => {
    console.log(ctx.cookie);
    console.log("ticket", ctx.cookies.get("ticket"));

    ctx.body = await ctx.db
      .collection("user")
      .findOne(
        { ticket: ctx.cookies.get("ticket") },
        { projection: { _id: 0, ticket: 0, pwid: 0 } }
      );
    console.log("body", ctx.body);
    if (!ctx.body) {
      ctx.cookies.set("ticket", null, { maxAge: 0, overwrite: true });
      ctx.unauthorized("Not found profile. Please login");
    }
  });

export default router;
