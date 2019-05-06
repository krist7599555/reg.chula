import axios from "axios";
import storage from "@util/diskStorage";
import buffer2thai from "@util/buffer2Thai";
import * as _ from "lodash";
import * as fs from "fs";
import * as scape from "./scape";
import * as request from "request";
import * as cheerio from "cheerio";
import * as tesseract from "tesseract.js";

const disk = new storage("disk/reg.data.json", __dirname);

// import curlirize from "axios-curlirize";
// curlirize(axios);

function cookie2session(cookieHeader: any) {
  return _.join(_.map(cookieHeader, s => s.split(";")[0]), "; ");
}

async function logout(session: string) {
  console.log("> logout");
  const res = await axios({
    method: "GET",
    url: "https://www2.reg.chula.ac.th/servlet/com.dtm.chula.reg.servlet.LogOutServlet?language=T",
    headers: { Cookie: session }
  });
  disk.set("session", cookie2session(res.headers["set-cookie"]));
}

async function initlogin(username: string, password: string) {
  console.log("> init login");
  const loginPage = await axios({
    method: "GET",
    url: "https://www2.reg.chula.ac.th/servlet/com.dtm.chula.reg.servlet.InitLogonServlet",
    withCredentials: true
  });
  const session = cookie2session(loginPage.headers["set-cookie"]);
  console.log("> session", session);
  const baseurl = "https://www2.reg.chula.ac.th";
  const captchaUrl = cheerio("img#CAPTCHA", loginPage.data)[0].attribs.src.replace("..", baseurl);
  disk.set("session", session);
  return {
    session,
    captchaUrl
  };
}

async function ocr_tesseract(url: string, session: string, filename: string) {
  const captcha = await axios.get(url, {
    responseType: "arraybuffer",
    headers: { Cookie: session }
  });
  const buffer = Buffer.from(captcha.data, "binary");
  const base64 = "data:image/png;base64," + buffer.toString("base64");
  const tessPage = await tesseract.recognize(buffer, { lang: "eng" });
  const text = tessPage.text.toUpperCase().replace(/\s+|[^A-Z0-9]/g, "");
  const confidence = tessPage.confidence;
  const path = __dirname + "/asset/" + filename;
  fs.writeFileSync(path, buffer, null);
  return {
    url,
    text,
    path,
    base64,
    confidence
  };
}

function login(session: string, { username, password, captcha }): Promise<string> {
  console.log("> login");
  return new Promise(async (resolve, reject) => {
    request(
      {
        timeout: 8000,
        method: "POST",
        url: "https://www2.reg.chula.ac.th/servlet/com.dtm.chula.reg.servlet.LogonServlet",
        headers: {
          "cache-control": "no-cache",
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: session
        },
        form: {
          userid: username,
          password: password,
          programsystem: "S",
          code: captcha,
          language: "T"
        }
      },
      async (err, response, body) => {
        if (err) {
          return reject(err.code);
        }
        if (typeof body == "string" && body.toUpperCase().indexOf("FAIL") == -1) {
          return resolve(session);
        }
        const html = await getHtmlWithSession(
          "https://www2.reg.chula.ac.th/servlet/com.dtm.chula.reg.servlet.LogonFailServlet?language=T",
          session
        );
        try {
          const message = cheerio("FONT[color='#FF0000']", html)[0].children[0].data.trim();
          return reject(message);
        } catch (e) {
          return resolve(html);
        }
      }
    );
  });
}

async function getValidSession(username: string, password: string): Promise<string> {
  for (let i = 0; i < 15; ++i) {
    const { session, captchaUrl } = await initlogin(username, password);
    const { text } = await ocr_tesseract(captchaUrl, session, "captcha.png");
    console.log("> ocr", text);
    try {
      return await login(session, { username, password, captcha: text });
    } catch (e) {
      if (typeof e == "string") {
        e = e.trim();
        if (e.indexOf("Charecter 4 digit is not match") != -1) {
          console.log("> retry");
          await logout(session);
          continue;
        }
        for (const err_item of [
          "ESOCKETTIMEDOUT",
          "เลขประจำตัวนิสิต และ/หรือ รหัสผ่าน ไม่ถูกต้อง",
          "ระบบตรวจพบว่าท่านได้เข้าสู่ระบบอยู่ในขณะนี้"
        ]) {
          if (e.toUpperCase().indexOf(err_item) != -1) {
            throw err_item;
          }
        }
      }
      console.error("ERROR: login:", e);
    }
  }
  throw "maximum retry";
}

async function clearsession() {
  if (disk.get("session") != null) {
    await logout(disk.get("session"));
    disk.remove("session");
    return true;
  }
  return false;
}

async function getHtmlWithSession(url: string, session: string) {
  const res = await axios({
    timeout: 5000,
    method: "GET",
    url: url,
    responseType: "arraybuffer",
    headers: { Cookie: session }
  });
  return buffer2thai(res.data.toString("binary"));
}

async function regdoc(session: string) {
  console.log("> regdoc");
  return getHtmlWithSession(
    "https://www2.reg.chula.ac.th/servlet/com.dtm.chula.admission.servlet.StudentStatusDocumentServlet/Status",
    session
  ).then(scape.regdoc);
}

async function pinfo(session: string) {
  console.log("> pinfo");
  return getHtmlWithSession(
    "https://www2.reg.chula.ac.th/servlet/com.dtm.chula.admission.servlet.StudentServlet/Registerth",
    session
  ).then(scape.pinfo);
}

async function cr60(session: string) {
  console.log("> cr60");
  return getHtmlWithSession(
    "https://www2.reg.chula.ac.th/servlet/com.dtm.chula.general.servlet.CR60Servlet",
    session
  ).then(scape.cr60);
}

export default async function main(
  username: string,
  password: string,
  opt = {} as {
    cr60?: boolean;
    pinfo?: boolean;
    regdoc?: boolean;
  }
) {
  if (_.some(opt)) {
    await clearsession();
    try {
      const session = await getValidSession(username, password);
      if (!session) return null;
      const [a, b, c] = await Promise.all([
        opt.cr60 ? await cr60(session) : null,
        opt.pinfo ? await pinfo(session) : null,
        opt.regdoc ? await regdoc(session) : null
      ]);
      const result = { cr60: a, pinfo: b, regdoc: c };
      await logout(session);
      console.log("-- FINISH OK --");
      return result;
    } catch (e) {
      await clearsession();
      console.log(e);
      console.log("-- FINISH ERR --");
      throw e;
    }
  } else {
    return {
      cr60: null,
      pinfo: null,
      regdoc: null
    };
  }
}
