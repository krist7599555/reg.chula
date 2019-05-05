import { Router, Request, Response } from "express";
import submit from "./submit";

const router = Router();

router.post("/submit", submit);

export default router;
