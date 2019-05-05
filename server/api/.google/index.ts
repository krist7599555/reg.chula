import { Router, Request, Response, NextFunction } from "express";
import { getAlbumDetail } from "./album";
import * as _ from "lodash";
const router = Router();

// credit https://www.publicalbum.org/blog/embedding-google-photos-albums
router.get("/album", (req, res) =>
  res
    .status(200)
    .json(
      [
        { title: "2019 Mar 23", url: "https://photos.app.goo.gl/MwzqQTRgDHZBRuU87" },
        { title: "2018 Dec 21", url: "https://photos.app.goo.gl/9MpTfZHmbjhxRuQy9" },
        { title: "2018 Dec 22", url: "https://photos.app.goo.gl/NRBFtzg5QwgDfC6K6" },
        { title: "2018 Dec 23", url: "https://photos.app.goo.gl/Y8Eg6tTMjayRrmCh6" },
        { title: "2018 Dec 24", url: "https://photos.app.goo.gl/yuWNMsBoFVCRaJKHA" },
        { title: "2018 Dec 25", url: "https://photos.app.goo.gl/4vRkbwbDWmWiLQZQ6" },
        { title: "2018 Dec 26", url: "https://photos.app.goo.gl/jFfrTX3pxkNzMaCb6" },
        { title: "2018 Dec 27", url: "https://photos.app.goo.gl/CB6qnH4Jy7DVXaJM8" },
        { title: "2018 Jun 05", url: "https://photos.app.goo.gl/5KgfoBuVpEjLkvWN6" },
        { title: "2017 May d1", url: "https://photos.app.goo.gl/dTPHQniKn833v2CeA" },
        { title: "2017 May d2", url: "https://photos.app.goo.gl/s6sD1jRpyVRAcT75A" },
        { title: "2017 May d3", url: "https://photos.app.goo.gl/XtiNBqKBcL53Ztn29" },
        { title: "2017 May d4", url: "https://photos.app.goo.gl/wuSuhTjA6TNcDt326" },
        { title: "2017 May d5", url: "https://photos.app.goo.gl/FxfWJ4a5k7498dw5A" },
        { title: "2017 May d6", url: "https://photos.app.goo.gl/aJCDGnAizuvL4Rnz8" },
        { title: "2017 May d7", url: "https://photos.app.goo.gl/yHseadVqAn9T4YPo6" }
      ].map(o => _.assign(o, { hash: o.url.slice(-17) }))
    )
);
router.get("/album/:albumId", async (req, res) => {
  const result = await getAlbumDetail("https://photos.app.goo.gl/" + req.params.albumId);
  res.status(200).send(result);
});

export default router;
