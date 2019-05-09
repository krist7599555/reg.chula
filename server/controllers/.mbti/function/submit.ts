import axios from "axios";
import * as _ from "lodash";
import * as fp from "lodash/fp";
import * as cheerio from "cheerio";
import * as traitsJSON from "./traits.json";
import * as detailJSON from "./detail.json";
import { disconnect } from "cluster";

// https://www.16personalities.com/articles/our-theory

export default async function submit(obj) {
  obj = _.mapKeys(obj, (v, k) => `a${k}`);
  const res = await axios({
    method: "POST",
    url: "https://www.16personalities.com/test-results",
    data: obj,
    timeout: 10000,
    withCredentials: true
  });
  const type: string = res.data.type;
  const cookie: string[] = res.headers["set-cookie"];
  const html: string = await axios({
    method: "GET",
    url: `https://www.16personalities.com/${type}-personality`,
    timeout: 10000,
    headers: {
      cookie
    }
  }).then(res => res.data);
  const raw_type5 = _.map(cheerio(".user-type-info", html)[0].children, ch =>
    _.trim(
      cheerio(ch)
        .text()
        .trim()
        .toLowerCase(),
      ":"
    )
  );
  const obj_type5 = _.fromPairs(_.chunk(_.compact(raw_type5), 2));
  const predetail = _.map(cheerio(".traits-wrapper:last-child > .trait > .bar", html), bar => {
    const [a, b, c, d] = _.map(cheerio(".count, .hidden-xs", bar), div => {
      return div.children[0].data;
    });
    return {
      [_.lowerCase(b)]: a,
      [_.lowerCase(d)]: c
    };
  });
  const names = ["mind", "energy", "nature", "tactics", "identity"];
  const detail = _.zipObject(names, predetail);
  const link = {
    th: `https://www.16personalities.com/th/${type}-บุคคลิกภาพ`,
    en: `https://www.16personalities.com/${type}-personality`
  };
  // return html;
  console.log(type);
  console.log(detail);
  return {
    type,
    type5: obj_type5.code,
    link,
    detail,
    desc: detailJSON[type].desc
  };
}
