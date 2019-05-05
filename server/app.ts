require("dotenv-extended").load({
  silent: false,
  errorOnMissing: true,
  errorOnExtra: true,
  errorOnRegex: true
});

import * as Koa from "koa";
import { Context, Request, Response } from "koa";
import { Nuxt, Builder } from "nuxt";
import * as mongo from "koa-mongo";
import * as response from "koa-respond";
import * as bodyParser from "koa-bodyparser";
import * as cors from "koa2-cors";
import * as send from "koa-send";
import * as mount from "koa-mount";
import * as logger from "koa-logger";
import * as skip from "koa-ignore";
import { resolve } from "path";

const consola = require("consola");

import api from "./api/index";
import config from "../nuxt.config";

export const app = new Koa();

app
  .use(cors())
  // .use(mount("/storage", ctx => send(ctx, ctx.path, { root: config.storagePath })))
  .use(response())
  .use(bodyParser())
  .use(mongo({ uri: process.env.MONGO_URL }))
  .use(api.routes())
  .use(api.allowedMethods());

console.log(
  api.stack.map(i => `${String(i.methods.slice(-1)).padEnd(5, ".")} ${i.path}`).join("\n")
);

export async function ssr() {
  const nuxt = new Nuxt(config);
  if (process.env.NODE_ENV != "production") {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  app.use(ctx => {
    ctx.status = 200;
    ctx.respond = false; // Bypass Koa's built-in response handling
    nuxt.render(ctx.req, ctx.res);
  });
}
