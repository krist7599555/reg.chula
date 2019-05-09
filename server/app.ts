require("dotenv-extended").load({
  silent: false,
  errorOnMissing: true,
  errorOnExtra: true,
  errorOnRegex: true
});

import * as Koa from "koa";
import { Context, Request, Response } from "koa";
import { Nuxt, Builder } from "nuxt";

const consola = require("consola");

import api from "./controllers/api";
import config from "../nuxt.config";

export const app = new Koa();

app.use(api.routes()).use(api.allowedMethods());

console.log("mongo:", process.env.MONGO_URL);
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
    ctx.respond = false;
    nuxt.render(ctx.req, ctx.res);
  });
}
