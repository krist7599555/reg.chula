import { Request } from "express";
import * as db from "@db/index";
import * as getlist from "./function/getcourselist";
import { GENED_CODE } from "@config/constant";
import getregcookie from "./function/getregcookie";
import { getcourse_withcookie } from "./function/getcourse";
import { getcourselist_withcookie } from "./function/getcourselist";
import { updateDbCode, updateDbCode_withcookie } from "@scaping/function/updatedbcourse";

export const root = [
  function(req, res) {
    return res.status(200).json(GENED_CODE);
  }
];

export const all = [
  async function(req: Request, res) {
    if (req.query.force) {
      const cookie = await getregcookie();
      for (const code in GENED_CODE) {
        await updateDbCode_withcookie(code, cookie);
      }
    }
    const docs = await db.course.find(
      { gened: { $ne: null } },
      { "schedule.record": 1, course: 1, courseName: 1, gened: 1 }
    );
    return res.status(200).send(docs);
  }
];

export const code = [
  async function(req: Request, res) {
    const code = String(req.params.code);
    const force = req.query.force;
    if (force) {
      await updateDbCode(code);
    }
    const docs = await db.course.find({ "gened.code": code });
    return res.status(200).send(docs);
  }
];
