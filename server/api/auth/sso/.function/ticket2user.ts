import { Router, Request, Response, NextFunction } from "express";
import * as _ from "lodash";
import * as db from "@db/index";

export default async function ticket2user(ticket: string) {
  return await db.users.findOne({ ticket });
}
