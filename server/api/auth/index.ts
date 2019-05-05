// import { Router } from "express";
import * as Router from "koa-router";
import sso from "./sso";
import line from "./line";
// import { RSA_NO_PADDING } from "constants";
const router = new Router();
// const router = Router();
// router.get("/", (req, res) => res.sendStatus(200));
// router.use("/line", line);

router
  .prefix("/auth")
  .get("/", ctx => (ctx.body = "auth"))
  .use(sso.routes())
  .use(sso.allowedMethods())
  .use(line.routes())
  .use(line.allowedMethods());

export default router;
