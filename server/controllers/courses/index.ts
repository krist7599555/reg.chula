import casRequest from '../scaping/casRequest';
export async function courses(ctx: Context) {
  const res = await ctx.courses
    .find('gened' in ctx.query ? { genedSection: { $ne: [] } } : {}, {
      projection:
        'full' in ctx.query
          ? {}
          : {
              courseID: 1,
              courseABBR: 1,
              courseTH: 1,
              courseEN: 1,
              gened: 1,
              create: 1,
              semester: 1,
              year: 1,
              faculty: 1,
              schedule: 1,
              credit: 1,
              genedSection: 1
            }
    })
    .toArray();
  return ctx.ok(res);
}

export async function courses_courseID(ctx: Context) {
  if ('force' in ctx.query) {
    const cas = new casRequest();
    const res = await cas.getCourseDetail(ctx.params.courseID);
    // console.log(res);
    const upd = await ctx.courses.updateOne(
      { courseID: res.courseID, year: res.year, semester: res.semester },
      { $set: res },
      { upsert: true }
    );
  }
  const course = await ctx.courses.findOne({ courseID: ctx.params.courseID });
  // console.log('>>>', course);
  return ctx.ok(course);
}

export async function courses_gened(ctx: Context) {}
