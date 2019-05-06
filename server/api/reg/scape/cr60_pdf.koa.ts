import * as cheerio from "cheerio";
import { map, join, trim, compact, filter, assign } from "lodash";
import { eq } from "lodash/fp";
import { Readable } from "stream";
import * as pdf from "pdf-parse";
import * as fs from "fs";
import { Context } from "koa";
import { AxiosInstance } from "axios/index.d";
import { CR60_PDF_GRADE_REPORT } from "../axios.reg";

function findAllIndex(ar: string[], fn: (val: any) => boolean) {
  return ar.reduce((res: number[], val, idx) => {
    if (fn(val)) res.push(idx);
    return res;
  }, []);
}

export default async function cr60_pdf(ctx: Context & { axios: AxiosInstance }, ouid: string) {
  // BODY CHECK

  ctx.assert(/\d{10}/.test(ouid), 400, "please send valid student number.");

  // DOWNLOAD IMAEG AS BUFFER

  console.log(`load ${ouid}.pdf start`);
  const pdf_buffer: Buffer = await ctx.axios(CR60_PDF_GRADE_REPORT(ouid)).then(res => res.data);
  console.log(`load ${ouid}.pdf finish`);

  // CREATE PDF ATTACH
  // ctx.attachment(`${ouid}.pdf`);
  // let stream = new Readable();
  // stream.push(pdf_buffer);
  // stream.push(null);
  if (ctx.accept.type("pdf") && !ctx.query.json) {
    ctx.status = 200;
    ctx.type = "application/pdf";
    ctx.set("content-disposition", `inline; filename="${ouid}.pdf"`);
    ctx.set("content-length", pdf_buffer.length.toString());
    ctx.body = pdf_buffer;
    // ctx.body = pdf_buffer;
    console.log("process as inline pdf");
    return;
  }
  console.log("process as json");
  // CONVERT TO TEXT

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
  let text: any[] = await pdf(pdf_buffer, { pagerender }).then(data =>
    compact(data.text.split("\n"))
  );

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
  if (text.length == 1 && text.includes("null")) {
    return ctx.notFound("not found data from " + ouid);
  }
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
      nationalId,
      field_birth,
      birth,
      field_admission,
      admission,
      faculty,
      department,
      fieldOfStudy
    ] = pop;
    ctx.assert.equal("/", field_slash, 500, `'${field_slash}' != '/'`);
    ctx.assert.equal("Name", field_name, 500, `'${field_name}' != 'Name'`);
    ctx.assert.equal("Gender", field_gender, 500, `'${field_gender}' != 'Gender'`);
    ctx.assert.equal("Birthdate", field_birth, 500, `'${field_birth} != 'Birthdate'`);
    ctx.assert.equal("Admission", field_admission, 500, `'${field_admission} != 'Admission'`);
    ctx.assert.equal("Student ID.", field_ouid, 500, `'${field_ouid}' != 'Student'`);
    ctx.assert.equal(
      "Identification No.",
      field_nationalId,
      500,
      `'${field_nationalId}' != 'Identification No.'`
    );
    const currPageHeader = {
      ouid: ouid.replace(/\s/g, ""),
      fullnameEN,
      genderEN,
      nationalId,
      birth,
      faculty,
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
    const [courseId, courseABBR, grade, credit] = text.splice(idx, 4, null);
    text[idx] = { courseId, courseABBR, grade, credit: Number(credit) };
  }
  text = text.reduce(
    ([semester, year, arr], val) => {
      if (typeof val == "string") {
        semester = val.slice(0, -5);
        year = Number(val.slice(-4));
      } else {
        arr.push(assign(val, { year, semester }));
      }
      return [semester, year, arr];
    },
    [null, null, []]
  )[2];

  return ctx.ok({ head: pageHeader, list: text });
}
