import { app, ssr } from "./app";
const con = require("consola");

(process.env.SKIP_NUXT ? Promise.resolve() : ssr())
  .catch(err => {
    if (process.env.NODE_ENV == "development") {
      con.error(`Running in "${process.env.NODE_ENV}" mode might need to rebuild nuxt.`);
    }
    con.error(err);
  })
  .finally(() => {
    app.listen(+process.env.PORT, () => {
      con.success(`serve on http://0.0.0.0:${process.env.PORT}`);
      con.info(`database ${process.env.MONGO_URL}`);
    });
  });
