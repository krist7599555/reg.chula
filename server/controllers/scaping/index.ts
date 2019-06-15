// import * as express from "express";
import * as Router from "koa-router";
import * as cheerio from "cheerio";
// import * as gened from "./gened";
import * as course from "./course";
// import * as faculty from "./faculty";

const router = new Router<any, Context>();

router.prefix("/scape");
router.get("*", ctx => ctx.forbidden("NOT IMPLEMENT YET"));
router.get("/", ctx =>
  ctx.ok({
    "/gened": "search for gened [1-5]",
    "/course": "7 dig course number",
    "/faculty": "find by faculty number eg. 21 engineer"
  })
);

router.get("/course", course.root);
router.get("/course/:code", course.code);

// router.get("/gened", gened.root);
// router.get("/gened/all", gened.all);
// router.get("/gened/:code", gened.code);

// router.get("/faculty", faculty.root);
// router.get("/faculty/:code", faculty.code);

export default router;
