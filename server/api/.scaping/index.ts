import * as express from "express";
import * as cheerio from "cheerio";

var router = express.Router();

router.get("/", (req, res) =>
  res.status(200).json({
    "/gened": "search for gened [1-5]",
    "/course": "7 dig course number",
    "/faculty": "find by faculty number eg. 21 engineer"
  })
);

import * as gened from "./gened";
import * as course from "./course";
import * as faculty from "./faculty";

router.get("/gened", gened.root);
router.get("/gened/all", gened.all);
router.get("/gened/:code", gened.code);

router.get("/course", course.root);
router.get("/course/:code", course.code);

router.get("/faculty", faculty.root);
router.get("/faculty/:code", faculty.code);

export default router;
