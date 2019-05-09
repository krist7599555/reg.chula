import { publicFieldUser, getUserByOuid } from "../models/index";

export default async function profile(ctx: Context, next) {
  console.log("HJELEO");
  const ouid: string = ctx.params.ouid || (await ctx.profile()).username;
  const ticket = ctx.cookies.get("ticket");
  ctx.assert(ouid, 400, "no ouid params");
  console.log("CDADSAC");

  const fnd = await getUserByOuid(ctx.user, ouid);

  ctx.state.profile = fnd;

  if (fnd.ticket == ctx.cookies.get("ticket")) ctx.ok(fnd);
  else ctx.ok(publicFieldUser(fnd));
}
