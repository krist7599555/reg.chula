import { Router } from "express";
import * as decrypt from "./decrypt";

const router = Router();

router.get("/decrypt", decrypt.root);
router.get("/decrypt/:token", decrypt.token);

export default router;
