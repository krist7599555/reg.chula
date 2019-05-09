import axios from "axios";
import { sso } from "@config/index";
import * as db from "@db/index";
import crypto from "@util/crypto";

export default function auth2ticket(username: string, password: string): Promise<string> {
  console.log("username", username, "password", password);
  // @ts-ignore-start
  return axios({
    method: "GET",
    url: sso.url + "/login",
    headers: {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "en,da;q=0.9",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      "x-requested-with": "XMLHttpRequest"
    },
    withCredentials: true,
    params: {
      username: username.slice(0, 8),
      password: password,
      service: "https://account.it.chula.ac.th",
      serviceName: "Chula+SSO"
    }
  })
    .then(res => res.data)
    .then(async res => {
      if (res.type == "error") throw new Error(res.content);
      await db.users.updateOne(
        { ouid: username },
        { ouid: username, pwid: crypto.encrypt(password), ticket: res.ticket },
        { upsert: true }
      );
      return res.ticket;
    });
}
