import axios from "axios";
import * as fetch from "isomorphic-fetch";
// import * as qs from "querystring";
export function getAlbumDetail(url) {
  const albumCode = url.slice(-17); // eg "MwzqQTRgDHZBRuU87",
  // @ts-ignore
  return axios({
    method: "POST",
    url: "https://www.publicalbum.org/api/v2/webapp/embed-player/jsonrpc",
    crossdomain: true,
    headers: {
      accept: "application/json",
      "accept-language": "en,da;q=0.9,th;q=0.8",
      "cache-control": "no-cache",
      "content-type": "text/plain;charset=UTF-8",
      pragma: "no-cache"
    },
    data: {
      method: "getGooglePhotosAlbum",
      params: {
        sharedLink: "https://photos.app.goo.gl/" + albumCode,
        imageWidth: 1920,
        imageHeight: 1080,
        includeThumbnails: false,
        attachMetadata: false
      },
      id: 3
    }
  }).then(res => res.data);
}
