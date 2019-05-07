import { Context } from "koa";
import * as Router from "koa-router";
import { range, get, assign } from "lodash";
import { eq } from "lodash/fp";
import * as _ from "lodash";
import * as fp from "lodash/fp";
import { initlogin, ocr_tesseract, login } from "./function";
import { createAxiosRegChulaTH } from "./axios.reg";
import { Readable } from "stream";
import * as pdf from "pdf-parse";
import cr54 from "./scape/cr54.koa";
import cr60_pdf from "./scape/cr60_pdf.koa";
import * as fs from "fs";
import axios from "axios";
import regsession from "./middleware.regsession";
import { cartesian_product } from "./util";
import { AxiosInstance } from "axios/index.d";

const router = new Router();

interface Course {
  courseId: string;
  courseABBR: string;
  grade?: string;
  credit: number;
  year: number;
  semester: number;
}

const saveAxiosReg = null;

router
  .prefix("/reg")
  .get("/test", (ctx: Context) => {
    ctx.ok("OK");
    ctx.badRequest("NO");
  })
  .get("/:ouid/pdf", regsession, async (ctx, next) => {
    await cr60_pdf(ctx, ctx.params.ouid);
    await next();
  })
  .get("/list", async (ctx, next) => {
    // [year(2)][type(1)][uniqId(4)][check(1)][faculty(2)]
    // type = [3478]
    // let cnt = 0;
    // const sat2List = (code: string) =>
    //   axios
    //     .post("http://www.sat2.chula.ac.th/cuat/autocomplete.htm?mode=student", {
    //       code,
    //       name: "",
    //       surname: ""
    //     })
    //     .then(res => res.data as any[]);
    // const year = [61, 60];
    // const type = [3, 4];
    // const dig = 3;
    // const lookfor = range(0, 10 ** dig).map(i => String(i).padStart(dig, "0"));
    // const list = cartesian_product(year, type, lookfor).map(fp.join(""));
    // const promise_list = list.map(sat2List);
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const s = new Readable();
    s._read = function() {};
    s.pipe(ctx.res);
    try {
      ctx.res.writeHead(200);
      // setTimeout(async () => {
      console.log("call");
      await sleep(1000);
      s.push("<Hello>");
      console.log(1);
      await sleep(1000);
      s.push("<Hello>");
      console.log(2);
      await sleep(1000);
      s.push("<Hello>");
      console.log(3);
      await sleep(1000);
      s.push(null);
      s.emit("end");
      console.log("end");
      // }, 1000);
    } catch {
      throw new Error("SOME ERROR");
    }
    return;
    // try {
    //   ctx.res.writeHead(200);
    //   // setTimeout(async () => {
    //   console.log("call");
    //   await sleep(1000);
    //   ctx.res.write("<Hello>");
    //   console.log(1);
    //   await sleep(1000);
    //   ctx.res.write("<Hello>");
    //   console.log(2);
    //   await sleep(1000);
    //   ctx.res.write("<Hello>");
    //   console.log(3);
    //   await sleep(1000);
    //   ctx.res.end();
    //   console.log("end");
    //   // }, 1000);
    // } catch {
    //   throw new Error("SOME ERROR");
    // }
    return;
    // try {
    //   // ctx.req.setTimeout;
    //   ctx.body = "xxx";
    //   const s = new Readable();
    //   s._read = function() {};
    //   s.pipe(ctx.res);
    //   ctx.res.writeHead
    //   for await (const data of promise_list) {
    //     // _.map(data, "code")
    //     console.log("data", ++cnt);
    //     if (cnt > 3) {
    //       break;
    //     }
    //     await new Promise(resolve => setTimeout(resolve, 700));
    //     // s.push(JSON.stringify(data).slice(1, -1));
    //   }
    //   s.push(null);
    //   // s.pipe(ctx.res);
    //   // ctx.body = s;
    // } catch (err) {
    //   console.error("fuck yahh", err);
    //   // ctx.ok("OKKK");
    // }
  });
// .get("/cr54", async ctx => {
//   const promise = {
//     cr54: ctx[REG_AXIOS].get("/servlet/com.dtm.chula.reg.servlet.CR54Servlet").then(res =>
//       cr54(res.data)
//     ),
//     cr60: ctx[REG_AXIOS].get("/servlet/com.dtm.chula.general.servlet.CR60Servlet").then(res =>
//       cr60(res.data)
//     )
//   };
//   const ans = {};
//   for (const key of ["cr54", "cr60"]) {
//     if (key in promise) {
//       ans[key] = await promise[key];
//       try {
//         JSON.stringify(ans[key]);
//       } catch {
//         console.error("Error on", key);
//       }
//     }
//   }
//   return ctx.ok(ans);
// });

export default router;
