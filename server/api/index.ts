import * as Router from "koa-router";
import * as mount from "koa-mount";
import skip from "koa-ignore";
import * as logger from "koa-logger";
import * as respond from "koa-respond";
import cookie from "koa-cookie";
import auth from "./auth";
const router = new Router();
router
  .prefix("/api")
  .get("/", ctx => {
    ctx.body = "OK";
  })
  .use(cookie())
  .use(logger())
  .use(respond())
  .use(auth.routes());
// router.prefix("/api").use(mount("/auth", auth));

export default router;
