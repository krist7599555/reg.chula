import * as _ from "lodash";
// import getlist from "./function/getcourselist";
import { getcourse } from "./function/getcourse";
import assertValidate from "@auth/sso/middleware/assertValidator";
import getregcookie from "./function/getregcookie";
import splitcourse from "./function/splitcourse";
import * as db from "@db/index";

export const root = [
  function(req, res) {
    return res.status(200).send({
      "/course": ["/:code"],
      "/faculty": ["/:code"],
      "/gened": ["/:code", "/all"]
    });
  }
];

export const code = [
  async function(req, res) {
    const code = req.params.code;
    const force = req.query.force;
    if (force) {
      const course = await getcourse(code);
      await db.course.updateOne({ course: code }, course, { upsert: true });
    }
    return res.status(200).json(await db.course.findOne({ course: code }));
  }
];
