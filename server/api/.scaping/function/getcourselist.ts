import axios from "axios";
import * as cheerio from "cheerio";
import * as _ from "lodash";
import * as qs from "qs";

import buffer2thai from "@util/buffer2Thai";
import html2list from "./html2list";
import regcookie from "./getregcookie";

export async function getcourselist(code: string) {
  const cookie = await regcookie();
  return await getcourselist_withcookie(code, cookie);
}

export async function getcourselist_withcookie(code: string, cookies: string) {
  const ge = code.length == 1 ? code : "";
  const fa = code.length == 2 ? code : "";
  const html = await axios({
    method: "GET",
    url:
      "https://cas.reg.chula.ac.th/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.CourseListNewServlet",
    params: {
      examdateCombo: "I2017207%2F05%2F1475",
      studyProgram: "S",
      semester: "2",
      acadyearEfd: "2561",
      "submit.x": "31",
      "submit.y": "12",
      courseno: fa,
      coursename: "",
      examdate: "",
      examstartshow: "",
      examendshow: "",
      faculty: fa,
      coursetype: "",
      genedcode: ge,
      cursemester: "2",
      curacadyear: "2561",
      examstart: "",
      examend: "",
      activestatus: "OFF",
      acadyear: "2561",
      lang: "T",
      download: "download"
    },
    withCredentials: true,
    responseType: "arraybuffer",
    headers: {
      Cookie: cookies
    }
  })
    .then(res => res.data.toString("binary"))
    .then(buffer2thai);
  return html2list(html);
}
