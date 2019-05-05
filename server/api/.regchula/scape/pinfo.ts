import * as cheerio from "cheerio";
import * as _ from "lodash";
import * as moment from "moment";

export default async function pinfo(html: string) {
  if (html.indexOf("ท่านไม่มีสิทธิทำรายการนี้") != -1) {
    return null;
  }
  const tabs = _.compact(
    _.map(cheerio("#Table35, #Table36, #Table37, #Table38, #Table39", html), tab =>
      _.assign.apply(
        _,
        _.map(cheerio("tr", tab), tr => {
          let line = _.map(
            cheerio(
              "td.flddisplay, td.fldDisplay, td[width=115], td[width=150], td[width=160], td[width=90]",
              tr
            ).contents(),
            td => td.data.trim().replace(/\s\s+/, " ")
          );

          for (let [a, b] of [
            ["เลขที่พาสปอร์ต", "E-Mail Address"],
            ["หมู่บ้าน", "ถนน"],
            ["ตรอก/ซอย", "อาคาร"]
          ]) {
            if (line[0] == a && line[1] == b) {
              line.splice(1, 0, "");
            }
          }

          if (line.length % 2 == 1) line.push("");
          return _.fromPairs(_.chunk(line, 2));
        })
      )
    )
  );
  const [a, b, c, d, e] = tabs;
  a.gender = a.เพศ == "ชาย" ? "male" : "female";

  moment.locale("th");
  const birth = moment(a["วัน เดือน ปี เกิด"], "ll").subtract(543, "years");
  a.birthdate = birth.format("L");
  a.birthstamp = birth.toDate().getTime();
  return {
    ประวัติส่วนตัว: a,
    ที่อยู่ตามทะเบียนบ้าน: b,
    ที่อยู่ปัจจุบัน: c,
    ที่อยู่ฉุกเฉิน: d,
    วุฒิการศึกษาที่ใช้สมัครเข้าศึกษา: e
  };
}
