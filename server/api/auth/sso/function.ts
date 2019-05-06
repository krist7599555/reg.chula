import axios from "axios";
// import { encrypt } from "./crypto";
import * as faculty from "./faculty.json";
import * as qs from "qs";
import { get } from "lodash";

interface SSO_Login {
  type: string | "error";
  content: string;
  ticket?: string;
}
export function sso_login(username, password): Promise<string> {
  console.log("ssologin");
  return axios
    .get(process.env.SSO_URL + "/login", {
      withCredentials: true,
      params: {
        username: username.slice(0, 8),
        password: password,
        service: "https://account.it.chula.ac.th/html",
        serviceName: "Chula+SSO"
      }
    })
    .then(res => {
      const cookie = get(res.headers, "['set-cookie'][0]");
      const DeeTGT = get(qs.parse(cookie), "DeeTGT");
      return DeeTGT;
    });
}

export function sso_validate(ticket) {
  return axios({
    method: "GET",
    url: process.env.SSO_URL + "/resources/users/me",
    headers: {
      "accept-encoding": "gzip;q=0,deflate,sdch",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
      // DeeAppId: process.env.SSO_appId,
      // DeeAppSecret: process.env.SSO_appSecret,
      Cookie: `DeeTGT=${ticket}`
    }
  })
    .then(res => res.data)
    .then(raw => {
      const facultyNUM = raw.ouid.slice(-2);
      const year = String(62 - +raw.ouid.slice(0, 2));
      return {
        ticket: ticket,
        ouid: raw.ouid,
        // pwid: encrypt(password),
        titleTH: undefined,
        titleEN: undefined,
        nameTH: raw.firstnameTH,
        nameEN: raw.firstname,
        surnameTH: raw.lastnameTH,
        surnameEN: raw.lastname,
        facultyTH: faculty[facultyNUM].nameTH,
        facultyEN: faculty[facultyNUM].nameEN,
        facultyNUM: facultyNUM,
        facultyABBR: faculty[facultyNUM].nameABBR,
        year: year
      };
    });
}

// curl 'https://account.it.chula.ac.th/resources/users/me' -H 'Cookie: DeeTGT=5cce823da7b11b0001c18bb4'
