import * as cheerio from "cheerio";
import * as _ from "lodash";

export default function regdoc(html: string) {
  const engname = cheerio("TD.fldDisplay", html)
    .contents()
    .toArray()
    .map(ch => ch.data.replace(/\s\s+/, " ").trim());
  const lead = _.zipObject("เลขนิสิตวรรค ที่นั่งสอบ ชื่อไทย ชื่อสากล".split(" "), engname);
  const sex = {
    เพศ: lead.ชื่อไทย.startsWith("นาย") ? "ชาย" : "หญิง",
    gender: lead.ชื่อสากล.startsWith("Mr") ? "male" : "female"
  };
  const table = _.assign.apply(
    _,
    _.map(cheerio("#Table42 TR", html), el => {
      const texts = _.map(
        cheerio(
          "TD[width=80] SPAN, TD[width=100] SPAN, TD[width=120] SPAN, TD[colspan=3] SPAN",
          el
        ).contents(),
        span => span.data
      );
      if (texts.length & 1) texts.push("");
      return _.fromPairs(_.chunk(texts, 2));
    })
  );
  return _.assign({}, lead, sex, table);
}
