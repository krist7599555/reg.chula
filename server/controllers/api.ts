import * as Router from "koa-router";
import auth from "./auth";
import middleware from "./api.middleware";
import login from "./sso/login";
import logout from "./sso/logout";
import profile from "./profile";
import grade from "./grade";

import * as reg from "./reg";

// import { Middleware } from "koa/index";

const router = new Router<any, Context>();
router
  .prefix("/api")
  .use(middleware())
  .get("/", ctx => ctx.ok("API"))
  .post("/login", login)
  .get("/logout", logout)
  .get("/profile", profile)
  // .get("/user/:ouid/profile", profile)
  // .get("/user/:ouid", ctx => ctx.ok(ctx.params.ouid))
  .get("/user/multi.json", reg.multi)
  .get("/user/:ouid/grade", grade)
  .get("/user/:ouid.pdf", reg.pdf)
  .get("/user/:ouid.json", reg.json)
  .get("/user/:ouid/cr54", reg.cr54);
// .get("/course/:id"); // course {head, list}

// .use(auth.routes())
// .use(auth.allowedMethods())
// .use(reg.routes())
// .use(reg.allowedMethods());
// router.prefix("/api").use(mount("/auth", auth));

export default router;
