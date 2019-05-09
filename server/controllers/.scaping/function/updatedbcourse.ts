import { GENED_CODE } from "@config/constant";
import getregcookie from "@scaping/function/getregcookie";
import { getcourselist_withcookie } from "./getcourselist";
import { getcourse_withcookie } from "./getcourse";
import * as db from "@db/index";
import chalk from "chalk";

export async function updateDbCode(code: string) {
  return updateDbCode_withcookie(code, await getregcookie());
}

export async function updateDbCode_withcookie(code: string, cookie: string) {
  const list = await getcourselist_withcookie(code, cookie);
  for (const courseId of list) {
    const scape_result = await getcourse_withcookie(courseId, cookie);
    console.log(chalk.green("update:"), courseId);
    await db.course.updateOne(
      { course: courseId },
      { ...scape_result, gened: GENED_CODE[code] || null },
      { upsert: true }
    );
  }
}
