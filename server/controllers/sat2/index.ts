import axios from "axios";
import * as _ from "lodash";
import * as assert from 'http-assert'
import { testUser } from "../../models";

export function getUserByOuid(ouid: string) {
  return axios
    .post("http://www.sat2.chula.ac.th/cuat/autocomplete.htm?mode=student", {
      code: ouid,
      name: "",
      surname: ""
    })
    .then(res => {
      if (_.isEmpty(res.data)) {
        return null;
      } else {
        return testUser(res.data);
      }
    });
}

export async function getUserByAttention(ouid: string) {
  assert(ouid.length > 3, 400, `ouid have not enough length '${ouid}'`)
  const html = axios.post("http://www.sat2.chula.ac.th/cuat/report.htm?mode=rpatstdsearch", {
    year: "",
    semester: "",
    dept: "",
    hourVolunteerWant: "10",
    status_close: "Y",
    stdId: ouid,
    stdCode: "",
    stdName: "",
    stdSurname: "",
    dateStart: "",
    dateStop:
  }).then(res => res.data)
  return html
}
