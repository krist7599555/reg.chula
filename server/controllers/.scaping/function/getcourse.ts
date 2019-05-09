import * as _ from "lodash";
import * as cheerio from "cheerio";
import buffer2thai from "@util/buffer2Thai";
import axios from "axios";
import html2course from "./html2course";
import getregcookie from "./getregcookie";

export async function getcourse_withcookie(course: string, cookies: string) {
  const html = await axios({
    method: "GET",
    url:
      "https://cas.reg.chula.ac.th/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.CourseScheduleDtlNewServlet",
    params: {
      courseNo: course,
      studyProgram: "S"
    },
    headers: {
      Cookie: cookies
    },
    responseType: "arraybuffer"
  }).then(res => buffer2thai(res.data.toString("binary")));
  return html2course(html);
}

export async function getcourse(course: string) {
  const cookie = await getregcookie();
  return getcourse_withcookie(course, cookie);
}
