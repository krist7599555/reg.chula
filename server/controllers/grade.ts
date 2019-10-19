import { getGradeByOuid } from '../models';
import * as _ from 'lodash';

export async function gradeByOuid(ctx, next) {
  console.log('FOUND');
  const grades = await getGradeByOuid(ctx.grade, ctx.params.ouid).catch(err => []);
  console.log('FOUND2');
  ctx.status = 200;
  // ctx.assert(grades && grades.length, 204, "no grade found. please rescape");
  ctx.body = grades;
  ctx.state.grade = grades;
  // await next(); // not fallthrough
}

interface GradeSummary {
  year: number;
  semester: number;
  total: number;
  detail: {
    grade: string;
    count: number;
  }[];
}

export async function gradeByCourseID(ctx: Context) {
  const res = await ctx.grade
    .aggregate<GradeSummary>()
    .match({ courseID: ctx.params.courseID })
    .group({
      _id: { year: '$year', semester: '$semester', grade: '$grade' },
      count: { $sum: 1 }
    })
    .group({
      _id: { year: '$_id.year', semester: '$_id.semester' },
      total: { $sum: '$count' },
      detail: { $push: { grade: '$_id.grade', count: '$count' } }
    })
    .project({
      _id: 0,
      year: '$_id.year',
      semester: '$_id.semester',
      total: '$total',
      detail: '$detail'
    })
    .sort({ year: 1, semester: 1 })
    .toArray();
  return ctx.ok(
    res.map(o => {
      o.detail = _.sortBy(o.detail, ({ grade }) => [grade.slice(0, 1), grade.length < 2]);
      return o;
    })
  );
}
