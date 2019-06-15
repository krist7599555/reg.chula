import * as fs from "fs";
import { Context } from "koa";
import { assign, compact, filter, join, map, trim, split } from "lodash";
import { eq } from "lodash/fp";
import * as path from "path";
import * as pdf from "pdf-parse";
import { Stream, Readable } from "stream";
import { PDF_GRADE_REPORT } from "./regAxios";
import { testUser, testGrade, updateUser, updateGrades } from "../../models/index";

function findAllIndex(ar: string[], fn: (val: any) => boolean) {
  return ar.reduce((res: number[], val, idx) => {
    if (fn(val)) res.push(idx);
    return res;
  }, []);
}

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export default async function cr60_pdf(
  ctx: Context,
  ouid: string,
  type: "pdf" | "json" | "offline"
) {
  // BODY CHECK
  ctx.assert(/\d{10}/.test(ouid), 400, "please send valid student number. " + ouid);

  // DOWNLOAD IMAEG AS BUFFER
  const s = new Date().getTime();
  console.log(ouid, "[Start  Download]");
  const pdf_stream: Stream =
    type == "offline"
      ? bufferToStream(
          fs.readFileSync(path.resolve(process.env.HOME, `Documents/sat3/pdf/${ouid}.pdf`))
        )
      : await ctx.axios(PDF_GRADE_REPORT(ouid)).then(res => res.data);
  const t = new Date().getTime();
  console.log(ouid, "[Finish Download]", (t - s) / 1000, "ms.");

  // CREATE PDF ATTACH
  const pagerender = pageData => {
    let render_options = {
      normalizeWhitespace: true,
      disableCombineTextItems: false
    };
    return pageData
      .getTextContent(render_options)
      .then(textContent =>
        join(compact(map(textContent.items, item => trim(item.str).replace(/\s+/g, " "))), "\n")
      );
  };

  const pdf_buffer: Buffer = await new Promise(resolve => {
    const buf = [];
    pdf_stream.on("data", d => {
      // console.log("chunk", d.length);
      buf.push(d);
    });
    pdf_stream.on("end", () => resolve(Buffer.concat(buf)));
  });

  let text: any[] = await pdf(pdf_buffer, { pagerender }).then(data =>
    compact(data.text.split("\n"))
  );
  console.log(ouid, "[Finish PDF Read]");

  // FILTER TEXT
  const remove = [
    "CA = CREDIT ATTEMPTED",
    "CG = CREDIT GRANTED",
    "GPA = GRADE POINT AVERAGE",
    "CAX = CUMULATIVE CA",
    "CGX = CUMULATIVE CG",
    "GPAX = CUMULATIVE GPA",
    "GPX = CUMULATIVE GP",
    "Student Grade Report",
    "CHULALONGKORN",
    "UNIVERSITY",
    "BANGKOK 10330",
    "THAILAND",
    "PAGE",
    "COURSE NO",
    "ABBREVIATED NAME",
    "CREDIT",
    "GRADE"
  ];
  text = filter(text, txt => !remove.includes(txt));
  ctx.assert(text.length > 1 && !text.includes("null"), 404, "not found data from " + ouid);
  for (const idx of findAllIndex(text, eq("GPX")).reverse()) {
    ctx.assert.equal("CA", text[idx - 6], 500, "have wrong number of CA-GPX");
    ctx.assert(/\d+\.\d{2}/.test(text[idx - 7]), 500, "expect GPX to be ##.##");
    ctx.assert(/\d+\.\d{2}/.test(text[idx - 13]), 500, "expect CA to be ##.##");
    text.splice(idx - 13, 14);
  }

  // EXTRACT PAGE HEADER
  let pageHeader = undefined;
  const as_of = /^As of /;
  for (const idx of findAllIndex(text, str => as_of.test(str)).reverse()) {
    ctx.assert(
      text[idx + 18].startsWith("Field of Study "),
      500,
      "expect data[idxOf(As of) + 18] = Field of Study"
    );
    const pop = text.splice(idx, 19);
    const [
      asof,
      curpage,
      ouid,
      field_slash,
      totalpage,
      field_name,
      fullnameEN,
      field_ouid,
      field_gender,
      genderEN,
      field_nationalId,
      nationalID,
      field_birth,
      birth,
      field_admission,
      admission,
      facultyEN,
      department,
      fieldOfStudy
    ] = pop;
    ctx.assert.equal("/", field_slash, 500, `'${field_slash}' != '/'`);
    ctx.assert.equal("Name", field_name, 500, `'${field_name}' != 'Name'`);
    ctx.assert.equal("Gender", field_gender, 500, `'${field_gender}' != 'Gender'`);
    ctx.assert.equal("Birthdate", field_birth, 500, `'${field_birth} != 'Birthdate'`);
    ctx.assert.equal("Admission", field_admission, 500, `'${field_admission} != 'Admission'`);
    ctx.assert.equal("Student ID.", field_ouid, 500, `'${field_ouid}' != 'Student'`);
    // Passport No. G55437735
    if (!["Passport No.", "Identification No."].includes(field_nationalId)) {
      ctx.assert(false, 500, `'${field_nationalId}' != 'Identification No. or Passport No.'`);
    }
    const [titleEN, nameEN, surnameEN] = split(fullnameEN, /\s+/g);

    const currPageHeader = {
      ouid: ouid.replace(/\s/g, ""),
      titleEN,
      nameEN,
      surnameEN,
      genderEN,
      nationalID: nationalID.trim(),
      birth,
      facultyEN,
      department,
      fieldOfStudy
    };
    if (pageHeader) {
      ctx.assert.deepEqual(pageHeader, currPageHeader, 500, "merge conflict on pdf page header");
    } else {
      pageHeader = currPageHeader;
    }
  }

  // GROUPING COURSE
  const isCourseId = /^\d{7}$/;
  for (const idx of findAllIndex(text, str => isCourseId.test(str)).reverse()) {
    const [courseID, courseABBR, grade, credit] = text.splice(idx, 4, null);
    text[idx] = { courseID, courseABBR, grade, credit: Number(credit) };
  }
  text = text.reduce(
    ([curSemester, curYear, arr], val) => {
      if (typeof val == "string") {
        curYear = Number(val.slice(-4));
        if (
          [
            "ACADEMIC LEAVE",
            "ON LEAVE",
            "ACADEMIC DISMISSAL",
            "NO CLASSIFICATION",
            "GRADUATED",
            "DISMISSAL"
          ].includes(val.trim())
        ) {
          return [curSemester, curYear, arr];
        }
        switch (val.slice(0, -5).trim()) {
          case "1ST SEMESTER":
            curSemester = 1;
            break;
          case "2ND SEMESTER":
            curSemester = 2;
            break;
          case "SUMMER SESSION":
            curSemester = 3;
            break;
          default:
            ctx.throw(500, `semester not exit in '${val.trim()}'`);
        }
        ctx.assert(
          [1, 2, 3].includes(curSemester),
          500,
          `curSemester should be in range 1-3 not '${curSemester}'`
        );
        ctx.assert(
          2000 < curYear && curYear < 2020,
          500,
          `curYear should be in range 2000-2020 not '${curYear}'`
        );
      } else {
        arr.push(
          assign(
            val,
            { year: curYear, semester: curSemester, section: null },
            { ouid: pageHeader.ouid }
          )
        );
      }
      return [curSemester, curYear, arr];
    },
    [null, null, []]
  )[2];

  const result = { user: testUser(pageHeader), grades: text.map(testGrade) };
  ctx.state.cpdf = result;
  switch (type) {
    case "pdf":
      ctx.status = 200;
      ctx.set("content-disposition", `inline; filename="${ouid}.pdf"`);
      ctx.type = "application/pdf";
      ctx.body = pdf_buffer;
      break;
    case "json":
    case "offline":
      ctx.body = result.grades;
      break;
  }
  const f = new Date().getTime();
  console.log(ouid, "[Finish Scaping ]", (f - t) / 1000, "ms.");
  return result;
}

const scape = async (ctx, ouid, type) => {
  const { user, grades } = await cr60_pdf(ctx, ouid, type);
  await updateUser(ctx.user, user);
  await updateGrades(ctx.grade, grades);
};

cr60_pdf.middleware = (type: "pdf" | "json") => async (ctx: Context, next) => {
  await scape(ctx, ctx.params.ouid, type);
};
cr60_pdf.middleware_offline = () => async (ctx: Context, next) => {
  await scape(ctx, ctx.params.ouid, "offline");
};

cr60_pdf.middleware_multiscape = () => async (ctx: Context, next) => {
  console.log("multi scape");
  let ouids = [];
  try {
    ouids = JSON.parse(ctx.query.ouid).map(id => String(id));
  } catch {
    ouids = [];
  }
  const res = { success: [], fail: [] };
  await Promise.all(
    ouids.map(async ouid => {
      console.log(ouid, "[try]");
      try {
        await scape(ctx, ouid, "json");
        res.success.push(ouid);
        console.log(ouid, "[SUCCESS]");
      } catch (err) {
        console.error(ouid, err.message);
        if (err.response) {
          console.error(ouid, err.response.data);
        } else {
          console.error(ouid, "[No Response]");
        }
        res.fail.push(ouid);
        console.log(ouid, "[FAIL]");
      }
    })
  );
  ctx.ok(res);
};
