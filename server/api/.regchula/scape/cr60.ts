import * as cheerio from "cheerio";
import * as _ from "lodash";
import * as types from "../types/CR60";

export default function cr60(html: string) {
  return _.map(cheerio("form > table[border=0]:not(table[width])", html), term => {
    let time = cheerio("tr:first-child p[align=CENTER] > b > font", term)[0].children[0].data;
    time = time.replace(/\s\s+/g, " ").trim();
    let semesterth = time
      .split(" ")[0]
      .replace("ภาคการศึกษา", "")
      .replace("ภาค", "");
    const period = {
      full: time,
      year: time.slice(-4),
      semesterth: semesterth,
      semester:
        semesterth.indexOf("ต้น") != -1
          ? 1
          : semesterth.indexOf("ปลาย") != -1
          ? 2
          : semesterth.indexOf("ร้อน") != -1
          ? 3
          : -1
    };

    const table = _.map(cheerio("tr:not(:last-child) table[border=1] tr", term), tr =>
      _.map(cheerio("td p font", tr), font => font.children[0].data.trim())
    );
    table[0] = table[0].map(s => s.replace("COURSE ", "").toLocaleLowerCase());
    const detail = _.map(
      table.slice(1),
      ar => (_.zipObject(table[0], ar) as unknown) as types.CR60_Course
    );
    const summary = _.assign.apply(
      _,
      _.map(cheerio("tr:last-child table[border=1] tr:last-child td p font", term), font => ({
        [font.children[0].data.trim()]: _.get(font.children[2], "data", null)
      }))
    );
    return {
      period,
      detail,
      summary
    } as types.CR60;
  });
}
