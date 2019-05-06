import * as Router from "koa-router";
import axios from "axios";
import { path } from "lodash/fp";
import { decrypt, encrypt } from "./crypto";
import * as _ from "lodash";
const router = new Router();

import * as faculty from "./faculty.json";
import { sso_login, sso_validate } from "./function";
import { COPYFILE_EXCL } from "constants";
router
  .prefix("/sso")
  .get("/", ctx => (ctx.body = "SSO"))
  .get("/login", ctx => (ctx.body = "NOT ALLOW GET"))
  .post("/login", async ctx => {
    const { username, password } = ctx.request.body;
    if (!username || !password) {
      return ctx.unauthorized("no username or password");
    }
    const fnd = await ctx.db.collection("user").findOne({ ouid: username });
    if (fnd) {
      if (decrypt(fnd.pwid) == password) {
        ctx.cookies.set("ticket", fnd.ticket, { overwrite: true, maxAge: 1000 * 60 * 60 * 24 });
        return ctx.ok({ ticket: fnd.ticket });
      } else {
        return ctx.unauthorized("password is wrong");
      }
    }
    const ticket = await sso_login(username, password);
    if (!ticket) {
      return ctx.unauthorized("can't verify ticket");
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
    ctx.created({ ticket });
  })
  .get("/profile", async ctx => {
    if (!ctx.cookies.get("ticket")) {
      return ctx.unauthorized("no authorization token");
    }
    const fnd = await ctx.db
      .collection("user")
      .findOne(
        { ticket: ctx.cookies.get("ticket") },
        { projection: { _id: 0, ticket: 0, pwid: 0 } }
      );

    if (!fnd) {
      ctx.cookies.set("ticket", null, { maxAge: 0, overwrite: true });
      ctx.unauthorized("not found profile. please logout/login");
    } else {
      ctx.ok(fnd);
    }
  });

export default router;
