import { Middleware } from "koa";

export default function logout(ctx: Context, next) {
  ctx.cookies.set("ticket", "", { maxAge: 0 });
  ctx.noContent();
  return next();
}
