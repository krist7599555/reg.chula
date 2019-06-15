import * as _ from "lodash";

export default function(q: string) {
  const codes = q.split(/\D+/g);
  if (!_.every(codes, code => /^(\d{1,2}|\d{7})$/.test(code))) {
    throw "code not match pattern";
  }
  return codes;
}
