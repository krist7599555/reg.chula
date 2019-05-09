// https://storage.googleapis.com/neris/public/images/types/faces/ISFP-male.svg
export function avatar(type: string, gender: "male" | "female") {
  return `https://storage.googleapis.com/neris/public/images/types/faces/${type.toUpperCase()}-${gender}.svg`;
}

// https://storage.googleapis.com/neris/public/images/types/infj-advocate.svg
import * as detail from "./detail.json";
export function model(type: string) {
  return detail[type].img;
}

// entp: debater
export function altname(type: string) {
  return detail[type].alt;
}
