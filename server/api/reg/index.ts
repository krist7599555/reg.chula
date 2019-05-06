import * as Router from "koa-router";
import { range, get, assign } from "lodash";
import { eq } from "lodash/fp";
import * as _ from "lodash";
import { initlogin, ocr_tesseract, login } from "./function";
import { createAxiosRegChulaTH } from "./axios.reg";
import { Readable } from "stream";
import * as pdf from "pdf-parse";
import cr54 from "./scape/cr54.koa";
import cr60_pdf from "./scape/cr60_pdf.koa";
import * as fs from "fs";
import { resolve } from "path";
import { LOGON_SERVLET, LOGIN_FAIL_SERVLET, LOGOUT_SERVLET } from "./axios.reg";

import regsession from "./middleware.regsession";

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

router.prefix("/reg").get("/:ouid/pdf", regsession, async (ctx, next) => {
  await cr60_pdf(ctx, ctx.params.ouid);
  await next();
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
