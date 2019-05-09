import * as Router from "koa-router";
import * as _ from "lodash";
import { decrypt, encrypt } from "../../crypto";
import { sso_login, sso_validate } from "./function";

const faculty = require("./faculty.json");
const router = new Router();

import login from "../../sso/login";

router
  .prefix("/sso")
  .get("/", ctx => (ctx.body = "SSO"))
  .post("/login", login)
  .get("/profile", async ctx => {
    if (!ctx.cookies.get("ticket")) {
      return ctx.unauthorized("no authorization token");
    }
    const fnd = await ctx.user.findOne(
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
