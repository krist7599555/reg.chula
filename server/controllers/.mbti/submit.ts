import { Request, Response } from "express";
import submit from "./function/submit";
import * as db from "@db/index";

export default async function(req: Request, res: Response, next) {
  const mbti = await submit(req.body).catch(next);
  await db.users.updateOne(
    { ticket: req.cookies.ticket },
    { mbti },
    { upsert: false, strict: false }
  );
  res.status(200).send(mbti);
}
