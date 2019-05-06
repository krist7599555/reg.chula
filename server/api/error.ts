// export default async (ctx, next) => next();
export default () => async (ctx, next) => {
  await next();
  // console.log("normally");
  // console.log(JSON.stringify(ctx.body));
  // try {
  // } catch (err) {
  //   console.log("[ERROR] here", err);

  //   if (typeof err == "string") {
  //     ctx.status = 500;
  //     ctx.body = { message: err };
  //   } else {
  //     ctx.status = err.statusCode || err.status || 500;
  //     ctx.body = { message: err.message };
  //   }
  // }
};
