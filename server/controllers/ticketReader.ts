export default async function ticketReader(ctx: Context, next?: Function) {
  const body = ctx.request.body;
  const ticket = ctx.cookies.get("ticket");
  if (body.username && body.password) {
    ctx.state.username = body.username as string;
    ctx.state.password = body.password as string;
  } else if (ticket) {
    console.log("ticket");
    const fnd = await ctx.user.findOne({ ticket });
    console.log(fnd);
    if (!fnd) {
      console.log("401");
      ctx.cookies.set("ticket", "", { maxAge: 0 });
      ctx.throw(401);
    }
    ctx.state.ticket = ticket;
    ctx.state.username = fnd.ouid;
    ctx.state.password = ctx.decrypt(fnd.pwid);
  } else {
    console.log("401");
    ctx.throw(401);
  }
  if (next) await next();
  return {
    username: ctx.state.username,
    password: ctx.state.password
  };
}
