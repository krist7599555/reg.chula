import * as iconv from "iconv-lite";

/* special thank to : http://www.online-decoder.com/th */
export default function buffer2thai(data: Buffer | string) {
  data = data instanceof Buffer ? data : Buffer.from(data, "binary");
  return iconv.decode(data, "ISO-8859-11");
}
