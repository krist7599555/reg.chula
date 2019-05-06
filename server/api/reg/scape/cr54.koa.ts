import * as cheerio from "cheerio";
import { map, get, zipObject, omit } from "lodash";
import { Context } from "koa";
import { AxiosInstance } from "axios/index.d";
import { CR54_SERVLET } from "../axios.reg";

interface Course54 {
  courseID: string;
  courseABBR: string;
  section: string;
  credit: string;
  note?: string;
}

export default async function cr54(ctx: Context & { axios: AxiosInstance }) {
  const html: string = await axios(CR54_SERVLET()).then(res => res.data);
  const table = map(cheerio("table#Table21 tr", html), tr => {
    return map(cheerio("td", tr), el =>
      cheerio(el)
        .text()
        .trim()
    );
  });
  const arrOfObj = map(table.slice(1), row => {
    const [order, courseID, courseABBR, section, credit, note] = row;
    return { courseID, courseABBR, credit, section, grade: null };
  });
  return arrOfObj;
}
