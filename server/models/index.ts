import * as _ from "lodash";
import * as assert from "http-assert";
import { Collection } from "mongodb";
import { USER_PUBLIC, FACULTY } from "./field";

function cartesian_product(...rest: any[]) {
  return _.reduce(rest, (a, b) => _.flatMap(a, x => _.map(b, y => x.concat([y]))), [[]]);
}

function validate_me(obj: any, validate_obj: { [key: string]: RegExp | ((val: any) => boolean) }) {
  for (const [key, check] of _.toPairs(validate_obj)) {
    if (key in obj) {
      if (typeof check == "function") {
        assert(check(obj[key]), 500, `wrong ${key} format "${obj[key]}"`);
      } else {
        assert(check.test(obj[key]), 500, `wrong ${key} format "${obj[key]}"`);
      }
    }
  }
  return obj;
}

export function testUser(u: any): User {
  if ("genderEN" in u) {
    const genderTH = { Male: "ชาย", Female: "หญิง" };
    const titleTH = { Male: "นาย", Female: "นางสาว" };
    u.genderTH = genderTH[u.genderEN];
    u.titleTH = titleTH[u.genderEN];
  }
  if ("ouid" in u) {
    u.year = Number(u.ouid.slice(0, 2));
    u.facultyNUM = Number(u.ouid.slice(-2));
    const { facultyABBR, facultyTH, facultyEN } = FACULTY[u.facultyNUM];
    u.facultyTH = facultyTH;
    u.facultyEN = facultyEN;
    u.facultyABBR = facultyABBR;
  }
  const validate_obj = {
    ouid: /^\d{10}$/,
    birth: /^[A-Z][a-z]+ \d+, \d{4}$/,
    titleEN: /^(Mr\.|Miss)$/,
    nameEN: /^[A-Za-z\-]+$/,
    surnameEN: /^[A-Za-z\-]+$/,
    nationalID: /^(\d{1} \d{4} \d{5} \d{2} \d{1}|[A-Z0-9]+)$/,
    year: y => _.inRange(y, 55, 65),
    facultyNUM: f => _.inRange(f, 20, 60)
  };
  validate_me(u, validate_obj);
  return u;
}

export function testGrade(g: any): Grade {
  const validate_obj = {
    ouid: /^\d{10}$/,
    grade: /^([VWSUAFMI]|([BCD]\+?))$/,
    courseID: /^\d{7}$/,
    courseABBR: /^[0-9A-Z\+\- /&]+$/,
    year: y => _.inRange(y, 2011, 2020),
    semester: s => _.inRange(s, 1, 4)
  };
  // courseABBR is empty eg. ENG EMAG (5830226621)
  if (_.isNaN(g.credit) && validate_obj.grade.test(g.courseABBR)) {
    g.credit = Number(g.grade);
    g.grade = g.courseABBR;
    g.courseABBR = "-";
  }
  // console.log(g);
  validate_me(g, validate_obj);
  return g;
}

export function publicFieldUser(user: User): User {
  // ! WARNING UNSURE FIELD
  return user;
  // return _.pick(user, userPublicField) as any;
}

export function updateGrades(db: Collection<Grade>, grades: any[]) {
  return db.bulkWrite(
    grades.map(g => ({
      updateOne: {
        filter: { ouid: g.ouid, courseID: g.courseID },
        update: testGrade(g),
        upsert: true
      }
    }))
  );
}

export function getGradeByOuid(db: Collection<Grade>, ouid: string) {
  return db.find({ ouid }, { projection: { _id: 0 } }).toArray();
}
export function getGradeByCourseId(db: Collection<Grade>, courseID: string) {
  return db.find({ courseID }, { projection: { _id: 0 } }).toArray();
}

export function updateUser(db: Collection<User>, user: User) {
  return db.updateOne({ ouid: user.ouid }, { $set: testUser(user) }, { upsert: true });
}
export function getUserByOuid(db: Collection<User>, ouid: string) {
  return db.findOne({ ouid }, { projection: { _id: 0 } });
}
