import axios from 'axios';
import * as bodyParser from 'koa-bodyparser';
import * as compose from 'koa-compose';
import cookie from 'koa-cookie';
import * as skip from 'koa-ignore';
import * as logger from 'koa-logger';
import * as mongo from 'koa-mongo';
import * as respond from 'koa-respond';
import * as cors from 'koa2-cors';
// import { resolve } from "path";
import * as crypto from './crypto';
import ticketReader from './ticketReader';

// .use(mount("/storage", ctx => send(ctx, ctx.path, { root: config.storagePath })))
export default (): compose.Middleware<any> =>
  compose([
    cors(),
    cookie(),
    bodyParser(),
    skip(logger()).if(() => process.env.JEST),
    mongo({ uri: process.env.MONGO_URL }),
    respond(),
    async (ctx: Context, next) => {
      ctx.axios = axios;
      ctx.user = ctx.db.collection('user');
      ctx.grade = ctx.db.collection('grade');
      ctx.encrypt = crypto.encrypt;
      ctx.decrypt = crypto.decrypt;
      ctx.profile = () => ticketReader(ctx);
      await next();
    }
  ]);
