import * as Router from "koa-router";
import * as mount from "koa-mount";
import * as skip from "koa-ignore";
import * as logger from "koa-logger";
import * as respond from "koa-respond";
import cookie from "koa-cookie";
import auth from "./auth";
import reg from "./reg";
import my_error from "./error";
const router = new Router();
router
  .prefix("/api")
  .use(cookie())
  .use(skip(logger()).if(() => process.env.JEST))
  .get("/", ctx => ctx.ok("OK"))
  .use(respond())
  .use(my_error())
  .use(auth.routes())
  .use(auth.allowedMethods())
  .use(reg.routes())
  .use(reg.allowedMethods());
// router.prefix("/api").use(mount("/auth", auth));

export default router;
