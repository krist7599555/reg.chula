import { users } from "@db/index";
// import a_cr60 from "./auth2cr60";
// import a_regdoc from "./auth2regdoc";
import a_reg from "./auth2reg";
import a_ticket from "./auth2ticket";
import t_raw from "./ticket2raw";
import u_user from "./user2user";
import * as _ from "lodash";

export default async function(username, password) {
  const ticket = await a_ticket(username, password);
  const sso = await u_user(await t_raw(ticket));
  const _curr = await users.findOne({ ouid: sso.ouid });
  const curr = _curr ? _curr.toObject() : {};
  if (_curr) {
    await _curr.update({ $set: { sso, ticket, ...sso } });
    // TODO: fixed this lazy
    return (await users.findOne({ ouid: sso.ouid })).toObject();
  }
  // TODO: this is un execute box
  const { regdoc, cr60, pinfo } = await a_reg(username, password, {
    cr60: _.isEmpty(curr.cr60),
    pinfo: _.isEmpty(curr.pinfo),
    regdoc: _.isEmpty(curr.regdoc)
  });

  curr.sso = sso || curr.sso;
  curr.cr60 = cr60 || curr.cr60;
  curr.pinfo = pinfo || curr.pinfo;
  curr.regdoc = regdoc || curr.regdoc;

  const merg = {
    faculty: sso.faculty,
    gender: curr.regdoc.gender,
    displayname: curr.displayname || sso.displayname,
    fullname: `${sso.firstname} ${sso.lastname}`,
    fullnameth: `${sso.firstnameth} ${sso.lastnameth}`,
    year: sso.ชั้นปี,
    birth: _.get(curr.pinfo, "ประวัติส่วนตัว.birthstamp", null),
    ticket
  };

  const newd = _.merge(curr, merg);
  const res = await users.updateOne({ ouid: sso.ouid }, newd, {
    upsert: true,
    strict: false
  });

  return newd;
}
