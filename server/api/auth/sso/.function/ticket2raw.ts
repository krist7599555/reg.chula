import { Router, Request, Response, NextFunction } from "express";
import * as _ from "lodash";
import * as requests from "superagent";
import { sso } from "@config/index";

const client = requests.agent();

export default async function ticket2raw(ticket: string) {
  return await client
    .post(sso.url + "/serviceValidation")
    .set({
      DeeAppId: sso.appId,
      DeeAppSecret: sso.appSecret,
      DeeTicket: ticket
    })
    .then(result => JSON.parse(result.text));
}
