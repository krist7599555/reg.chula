import axios from "axios";
import * as cheerio from "cheerio";
import * as _ from "lodash";
import * as qs from "qs";

import buffer2thai from "@util/buffer2Thai";

export function html2list(html: string) {
  let list = [] as string[];
  for (const page of _.values(cheerio("TABLE#Table4 TR", html))) {
    try {
      let font = cheerio("FONT", page)[0];
      const course = font.children[0].data.trim();
      if (/^\d{7}$/.test(course)) {
        list.push(font.children[0].data.trim());
      }
    } catch (e) {}
  }
  return list;
}

export default html2list;
