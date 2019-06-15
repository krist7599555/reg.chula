import { sso_login, sso_validate } from '../auth/sso/function';
import { assign } from 'lodash';
import { updateUser } from '../../models';
import { BaseContext } from 'koa';
// import { Middleware } from "koa-compose";

const HOUR = 1000 * 60 * 60;

export default async function login(ctx: Context, next) {
  const remember = 'remember' in ctx.query;
  const cookieOption = { overwrite: true, maxAge: 24 * HOUR };

  const { username, password } = ctx.request.body;
  ctx.assert(username, 400, 'no username');
  ctx.assert(password, 400, 'no password');
  const fnd = await ctx.user.findOne({ ouid: username });

  if (fnd && fnd.pwid && ctx.decrypt(fnd.pwid) == password) {
    ctx.cookies.set('ticket', fnd.ticket, cookieOption);
    ctx.noContent();
    return;
  }

  const ticket = await sso_login(username, password);
  ctx.assert(ticket, 401, "can't verify ticket");

  const user = await sso_validate(ticket);
  updateUser(ctx.user, assign(user, { pwid: ctx.encrypt(password) }) as any);

  ctx.cookies.set('ticket', ticket, cookieOption);
  ctx.created('');
  await next();
}
