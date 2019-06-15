import * as _ from "lodash";
import axios from "axios";


class CasChulaRequest() {
  constructor(cookie) {this.setCookie(cookie)}
  getCookie() {return this.cookie}
  setCookie(cookie) {
    this.cookie = cookie;
    this.axios = axios.create({
      method: "GET",
      baseURL: "https://cas.reg.chula.ac.th",
      withCredentials: true,
      headers: {
        Cookie: cookie || ""
      }
    })
  }
  fetchHead() {
    return this.axios.get("/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.QueryCourseScheduleNewServlet").then(res => {
      const cookie = _.join(res.headers["set-cookie"], ";")
      this.setCookie(cookie)
      return res.data
    })
  }
  fetchSide() {
    this.axios({
      url:
        "/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.CourseListNewServlet",
      params: {
        examdateCombo: "I2017207%2F05%2F1475",
        studyProgram: "S",
        semester: "2",
        acadyearEfd: "2561",
        "submit.x": "31",
        "submit.y": "12",
        courseno: "",
        coursename: "",
        examdate: "",
        examstartshow: "",
        examendshow: "",
        faculty: "",
        coursetype: "",
        genedcode: "1",
        cursemester: "1",
        curacadyear: "2561",
        examstart: "",
        examend: "",
        activestatus: "OFF",
        acadyear: "2561",
        lang: "T",
        download: "download"
      },
      responseType: "arraybuffer"
    }).then(res => cookie);
  }
}

export default async function getregcookie() {
  const cookie = await fetch_head();
  await fetch_side(cookie);
  return cookie;
}

function fetch_head() {
  return axios({
    method: "GET",
    url:
      "https://cas.reg.chula.ac.th/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.QueryCourseScheduleNewServlet",
    withCredentials: true
  }).then(res => _.join(res.headers["set-cookie"], ";"));
}

function fetch_side(cookie: string) {
  return axios({
    method: "GET",
    url:
      "https://cas.reg.chula.ac.th/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.CourseListNewServlet",
    headers: {
      Cookie: cookie
    },
    params: {
      examdateCombo: "I2017207%2F05%2F1475",
      studyProgram: "S",
      semester: "2",
      acadyearEfd: "2561",
      "submit.x": "31",
      "submit.y": "12",
      courseno: "",
      coursename: "",
      examdate: "",
      examstartshow: "",
      examendshow: "",
      faculty: "",
      coursetype: "",
      genedcode: "1",
      cursemester: "1",
      curacadyear: "2561",
      examstart: "",
      examend: "",
      activestatus: "OFF",
      acadyear: "2561",
      lang: "T",
      download: "download"
    },
    withCredentials: true,
    responseType: "arraybuffer"
  }).then(res => cookie);
}
