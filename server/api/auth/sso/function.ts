import axios from "axios";
// import { encrypt } from "./crypto";
import * as faculty from "./faculty.json";

interface SSO_Login {
  type: string | "error";
  content: string;
  ticket?: string;
}
export function sso_login(username, password): Promise<SSO_Login> {
  return axios
    .get(process.env.SSO_URL + "/login", {
      params: {
        username: username.slice(0, 8),
        password: password,
        service: "https://account.it.chula.ac.th",
        serviceName: "Chula+SSO"
      }
    })
    .then(res => res.data);
}

export function sso_validate(ticket) {
  return axios({
    method: "POST",
    url: process.env.SSO_URL + "/serviceValidation",
    headers: {
      DeeAppId: process.env.SSO_appId,
      DeeAppSecret: process.env.SSO_appSecret,
      DeeTicket: ticket
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
        nameTH: raw.firstnameth,
        nameEN: raw.firstname,
        surnameTH: raw.lastnameth,
        surnameEN: raw.lastname,
        facultyTH: faculty[facultyNUM].nameTH,
        facultyEN: faculty[facultyNUM].nameEN,
        facultyNUM: facultyNUM,
        facultyABBR: faculty[facultyNUM].nameABBR,
        year: year
      };
    });
}
