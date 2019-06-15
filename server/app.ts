require("dotenv-extended").load({
  silent: false,
  errorOnMissing: true,
  errorOnExtra: true,
  errorOnRegex: true
});

import * as Koa from "koa";
import { Context, Request, Response } from "koa";

const consola = require("consola");

import api from "./controllers/api";

export const app = new Koa();

app.use(api.routes()).use(api.allowedMethods());

console.log("mongo:", process.env.MONGO_URL);
console.log(
  api.stack.map(i => `${String(i.methods.slice(-1)).padEnd(5, ".")} ${i.path}`).join("\n")
);
