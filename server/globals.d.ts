import * as Koa from "koa";
import { Db, Collection } from "mongodb";
import { AxiosInstance } from "axios";

declare module "koa" {
  interface Context {
    // axios
    axios: AxiosInstance;

    // https://www.npmjs.com/package/koa-mongo
    db: Db;
    user: Collection<User>;
    grade: Collection<Grade>;

    // simple crypto
    encrypt(str: string): string;
    decrypt(str: string): string;

    // user
    profile(): Promise<{ username: string; password: string }>;

    // https://www.npmjs.com/package/koa-respond
    ok(body: any): Context; // - HTTP 200
    created(body: any): Context; // - HTTP 201
    noContent(): Context; // - HTTP 204 [always sends an empty response!]
    badRequest(body: any): Context; // - HTTP 400
    unauthorized(body: any): Context; // - HTTP 401
    forbidden(body: any): Context; // - HTTP 403
    notFound(body: any): Context; // - HTTP 404
    internalServerError(body: any): Context; // - HTTP 500
  }
}
declare global {
  interface Context extends Koa.Context {}

  interface User {
    ticket?: string;
    ouid: string;
    pwid?: string;
    nationalID?: string;
    genderTH?: "ชาย" | "หญิง";
    genderEN?: "Male" | "Female";

    titleTH?: "นาย" | "นางสาว";
    titleEN?: "Mr." | "Miss";
    nameTH?: string;
    nameEN?: string;
    surnameTH?: string;
    surnameEN?: string;

    facultyTH?: string;
    facultyEN?: string;
    facultyNUM: number;
    facultyABBR?: string;

    department?: string;
    fieldOfStudy?: string;

    year: number; // 57-63
    birth: string; // [Aug 13, 1998] from pdf
  }

  interface Grade {
    ouid: string;
    courseID: string;
    courseABBR: string;
    year: number; // 2017
    semester: 1 | 2 | 3;
    credit: number;
    grade?: string;
    section?: number;
  }
}
