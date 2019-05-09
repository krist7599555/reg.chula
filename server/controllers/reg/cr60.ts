import * as cheerio from "cheerio";
import { map } from "lodash";

export default function cr60(html: string) {
  console.warn("cr60 is deprecate. please use cr60.pdf instance.");
  return map(
    cheerio("form[name=cr60Form] > table:not(table[width]):not(:last-child)", html),
    table => {
      let time = cheerio("tr:first-child p[align=CENTER] b", table)
        .text()
        .trim()
        .replace(/\s+/g, " ");
      if (!time) {
        return null;
      }
      let year = time.match(/\d{4}/)[0];
      let term = time.match(/\S+/)[0];
      let list = map(cheerio("table#Table1 tr:not(:first-child)", table), row => {
        const [courseID, courseABBR, credit, grade] = map(cheerio("td", row), td =>
          cheerio(td)
            .text()
            .trim()
        );
        return { courseID, courseABBR, credit, grade, year, term };
      });
      return { year, term, list };
    }
  );
}
