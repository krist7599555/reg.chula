import { app } from "./app";
const con = require("consola");

const PORT = process.env.PORT || 8080;

app.listen(+PORT, () => {
  con.success(`serve on http://0.0.0.0:${PORT}`);
  con.info(`database ${process.env.MONGO_URL}`);
});
