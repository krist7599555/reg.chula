import { getGradeByOuid } from "../models";

export default async function grade(ctx, next) {
  console.log("FOUND");
  const grades = await getGradeByOuid(ctx.grade, ctx.params.ouid).catch(err => []);
  console.log("FOUND2");
  ctx.status = 200;
  // ctx.assert(grades && grades.length, 204, "no grade found. please rescape");
  ctx.body = grades;
  ctx.state.grade = grades;
  // await next(); // not fallthrough
}
