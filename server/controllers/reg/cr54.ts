import * as cheerio from "cheerio";
import { map, get, zipObject, omit, assign } from "lodash";
import { Context } from "koa";
import { AxiosInstance } from "axios";
import { CR54_SERVLET } from "./regAxios";
import { updateGrades } from "../../models";

export const func = async (_axios: AxiosInstance) => {
  const html: string = await _axios(CR54_SERVLET()).then(res => res.data);
  const table = map(cheerio("table#Table21 tr", html), tr => {
    return map(cheerio("td", tr), el =>
      cheerio(el)
        .text()
        .trim()
    );
  });
  const arrOfObj = map(table.slice(1), row => {
    const [order, courseID, courseABBR, section, credit, note] = row;
    return { courseID, courseABBR, credit: Number(credit), section: Number(section), grade: null };
  });
  return arrOfObj;
};
export const middleware = () => async (ctx, next) => {
  ctx.assert(ctx.state.username, 401, "not authen for cr54");
  let res = await func(ctx.axios);
  res = res.map(g => assign(g, { ouid: ctx.state.username }));
  await updateGrades(ctx.grade, res);
  ctx.state.cr54 = res;
  ctx.state.body = res;
  return next();
};
