import CasRequest from "./casRequest";

export const root = ctx => ctx.ok("/course/:code");
export const code = async (ctx: Context) => {
  const code = ctx.params.code;
  const cas = new CasRequest();
  await cas.fetchHead();
  await cas.fetchSideList();
  ctx.status = 200;
  ctx.body = await cas.getCourseDetail(code);
};
