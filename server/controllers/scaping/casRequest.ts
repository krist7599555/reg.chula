import axios from "axios";
import * as iconv from "iconv-lite";
import * as _ from "lodash";
import * as https from "https";
export default class CasRequest {
  axios = null;
  cookie = "";
  constructor(cookie = "") {
    this.setCookie(cookie);
  }
  getCookie(): string {
    return this.cookie;
  }

  setCookie(cookie) {
    this.cookie = cookie;
    this.axios = axios.create({
      method: "GET",
      baseURL: "https://cas.reg.chula.ac.th",
      withCredentials: true,
      responseType: "arraybuffer",
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      headers: {
        Cookie: cookie || ""
      },
      timeout: 5000
      // proxy: { host: "127.0.0.1", port: 3000 }
    });
    axios.interceptors.response.use(response => {
      // response.data.toString("binary") // un sure
      const thai = response.headers["Content-Type"].includes("WINDOWS-874");
      response.data = iconv.decode(response.data, thai ? "WINDOWS-874" : "UTF-8");
      return response;
    });
  }
  fetchHead() {
    return this.axios
      .get("/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.QueryCourseScheduleNewServlet")
      .then(res => {
        const cookie = _.join(res.headers["set-cookie"], ";");
        this.setCookie(cookie);
        return res.data;
      });
  }
  fetchSideList(code: string = "2") {
    const genedCode = code.length == 1 ? code : "";
    const facultyCode = code.length == 2 ? code : "";
    return this.axios
      .get("/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.CourseListNewServlet", {
        examdateCombo: "I2017207%2F05%2F1475",
        studyProgram: "S",
        semester: "2",
        acadyearEfd: "2561",
        "submit.x": "31",
        "submit.y": "12",
        courseno: facultyCode,
        coursename: "",
        examdate: "",
        examstartshow: "",
        examendshow: "",
        faculty: facultyCode,
        coursetype: "",
        genedcode: genedCode,
        cursemester: "2",
        curacadyear: "2561",
        examstart: "",
        examend: "",
        activestatus: "OFF",
        acadyear: "2561",
        lang: "T",
        download: "download"
      })
      .then(res => res.data);
  }
  fetchCourseDetail(course: string) {
    return axios
      .get("/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.CourseScheduleDtlNewServlet", {
        params: {
          courseNo: course,
          studyProgram: "S"
        }
      })
      .then(res => res.data);
  }
  getSideList(code: string = "") {
    return this.fetchSideList(code).then(html2sideList);
  }
  getCourseDetail(course: string) {
    return this.fetchCourseDetail(course).then(html2courseDetail);
  }
}

export function html2sideList(html: string) {
  let list = [] as string[];
  for (const page of _.values(cheerio("TABLE#Table4 TR", html))) {
    try {
      let font = cheerio("FONT", page)[0];
      const course = font.children[0].data.trim();
      if (/^\d{7}$/.test(course)) {
        list.push(font.children[0].data.trim());
      }
    } catch {}
  }
  return list;
}

export function html2courseDetail(html: string) {
  let [top, info, credit, exam, schedule] = _.values(cheerio("FORM TABLE", html));
  let ginfo = _.map([info, credit, exam], mytable => {
    let m = _.map(cheerio("FONT", mytable), dom => {
      let res: string[] = [];
      for (let txt of dom.children || []) {
        if (txt && txt.type == "text") {
          res.push(txt.data.trim());
        } else if (txt && txt.children) {
          res.push(txt.children[0].data.trim());
        }
      }
      return res;
    });
    return _.flatten(m).map(s => s.replace(/\s\s+/g, " "));
  });

  if (_.isEmpty(ginfo[0])) {
    throw "invalid course code";
  }
  if (ginfo[1][0] == "ระบบยังไม่พร้อมใช้งานในขณะนี้") {
    throw "ระบบยังไม่พร้อมใช้งานในขณะนี้";
  }

  let scedtable: string[][] = _.map(cheerio("TBODY TR", schedule), row => {
    let res: any = _.map(cheerio("TD", row), box => {
      try {
        const FONT = cheerio("FONT", box)[0].children[0];
        if (FONT.type == "text") return FONT.data.trim().replace(/\s\s+/g, " ");
        else if (FONT.type == "tag") {
          const nobr = cheerio("NOBR", box)[0];
          return nobr.children[0].data.trim().replace(/\s\s+/g, " ");
        } else {
          return "";
        }
      } catch (e) {
        return "";
      }
    })
      // .map(buffer2thai)
      .reduce((ar, str) => {
        if (str == "วัน-เวลาเรียน") {
          ar.push("วันเรียน");
          ar.push("เวลาเรียน");
        } else if (str != "Regis/Max") {
          ar.push(str);
        }
        return ar;
      }, []);
    return res[0] == "" && /^[0-9]+$/.test(res[1]) ? res.slice(1) : res;
  }).slice(1);

  // FILL EMPTY SLOT
  const genedSection = new Set();
  for (let i = 0; i < scedtable.length; ++i) {
    while (scedtable[i].length < 9) scedtable[i].push("");
    scedtable[i][7] = scedtable[i][7].replace(/GEN(-| )?ED(-| )/g, "GENED-");
    if (scedtable[i][0] == "" || (i && scedtable[i][0] == scedtable[i - 1][0])) {
      for (let j of [0, 7, 8]) {
        if (scedtable[i][j] == "") scedtable[i][j] = scedtable[i - 1][j];
      }
    }
    if (scedtable[i][7].indexOf("GENED") != -1) {
      genedSection.add(scedtable[i][0]);
    }
  }

  // MERGE TIME
  scedtable = (() => {
    const newscedtable = [scedtable[0]];
    _.map(scedtable.slice(1), row => {
      const last = _.last(newscedtable);
      const same = _.zipWith(row, last, _.isEqual);
      if (_.every(_.pick(same, [0, 2, 4, 5, 6, 7, 8]))) {
        const tm1 = last[3];
        const tm2 = row[3];
        if (tm1 == tm2) {
          newscedtable[newscedtable.length - 1][1] += " " + row[1];
        } else {
          try {
            const [a, b] = tm1.split("-");
            const [c, d] = tm2.split("-");
            if (b == c) {
              newscedtable[newscedtable.length - 1][3] = `${a}-${d}`;
            } else {
              throw "time not connect";
            }
          } catch (e) {
            newscedtable.push(row);
          }
        }
      } else {
        newscedtable.push(row);
      }
    });
    return newscedtable;
  })();

  let scedbyscetion = (() => {
    let objlist = _.map(scedtable.slice(1), row => {
      return _.zipObject(scedtable[0], row);
    });
    let grpbysect = Object(_.groupBy(objlist, "ตอนเรียน"));
    for (const sec in grpbysect) {
      for (let idx in grpbysect[sec]) {
        let record = grpbysect[sec][idx];
        try {
          const [reg, mxx] = record["จำนวนนิสิต"].split("/");
          record["ลงทะเบียน"] = Number(reg);
          record["ที่นั้งทั้งหมด"] = Number(mxx);
        } catch (e) {}
        if (record["เวลาเรียน"].indexOf("-") != -1) {
          [record["เวลาเริ่ม"], record["เวลาจบ"]] = _.split(record["เวลาเรียน"], "-");
        } else {
          record["เวลาเริ่ม"] = record["เวลาจบ"] = record["เวลาเรียน"];
        }
      }
    }
    return grpbysect;
  })();
  ginfo[2] = ginfo[2].filter(s => {
    return ["วันสอบกลางภาค :", "", "วันสอบปลายภาค :"].indexOf(s) == -1;
  });
  if (ginfo[2][0] == ginfo[2][1] + " " + ginfo[2][2]) {
    ginfo[2] = [ginfo[2][0], ginfo[2][0]];
  }
  const result = {
    course: ginfo[0][2],
    yeartime: ginfo[0][0].replace("  ", " "),
    group: ginfo[0][1],
    courseName: {
      id: ginfo[0][2],
      nameSHORT: ginfo[0][3],
      nameTH: ginfo[0][4],
      nameEN: ginfo[0][5]
    },
    create: new Date().getTime(),
    faculty: ginfo[0][6],
    credit: ginfo[1][0],
    creditDetail: {
      credit: ginfo[1][2],
      hour: ginfo[1][3]
    },
    prerequisite: ginfo[1][5],
    exam: {
      midterm: ginfo[2][0].replace(/\s\s+/g, " "),
      final: ginfo[2][1].replace(/\s\s+/g, " ")
    },
    schedule: {
      table: scedtable,
      record: scedbyscetion,
      genedSection: Array.from(genedSection).map(Number)
    },
    gened: null
  };
  return result;
}
