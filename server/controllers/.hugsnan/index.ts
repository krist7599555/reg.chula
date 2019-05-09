import { Router, Request, Response, NextFunction } from "express";
import * as db from "@db/index";
import * as _ from "lodash";
const router = Router();

function allUser() {
  return db.users.find({ hugsnan: { $exists: true } });
}
async function stat() {
  const allusers = await allUser();
  const field = { "hugsnan.คำนำหน้า": {}, คณะ: {}, ชั้นปี: {} };
  for (const k in field) {
    field[k] = _.countBy(allusers, o => _.get(o.toObject(), k));
  }
  return _.mapKeys(field, (v, k) => k.replace("hugsnan.", ""));
}

router.get("/all", async (req, res) => res.status(200).json(await allUser()));
router.get("/statistic", async (req, res) => res.status(200).json(await stat()));
router.post("/submit", async (req: Request, res: Response) => {
  const ticket = req.cookies.ticket;
  const body = req.body;
  if (!ticket) return res.status(400).send("please login");
  if (!body) return res.status(400).send("please send body");
  console.log("body", body);
  const user = await db.users.findOneAndUpdate(
    { ticket },
    {
      hugsnan: {
        ...body,
        time: new Date().getTime()
      }
    }
  );
  return res.status(200).json(user.toJSON());
});

router.post("/score/:ouid", async (req, res) => {
  const ticket = req.cookies.ticket;
  const body = req.body;
  const ouid = req.params.ouid;
  if (!ticket) return res.status(400).send("please login");
  if (!body || _.isEmpty(body)) return res.status(400).send("please send body");
  if (!ouid) return res.status(400).send("please send student code");
  const auth = await db.users.findOne({ ticket });
  if (!auth) return res.status(400).send("token expired");
  const user = await db.users.findOneAndUpdate(
    { ouid },
    {
      [`hugsnan._score.${auth.toObject().ouid}`]: {
        ...body
      }
    },
    { new: true }
  );
  return res.status(200).send(user);
});

router.post("/update/:ouid", async (req, res) => {
  const user = await db.users.findOne({ ouid: req.params.ouid });
  const body = req.body;
  for (const k in body) {
    user.set(k, body[k]);
  }
  const result = await user.save({ validateBeforeSave: false });
  return res.status(200).send(result.toJSON());
  const s = `http://graph.facebook.com/$UserID/picture?type=large`;
});

export default router;
