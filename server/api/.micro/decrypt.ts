import crypto from "@util/crypto";

function descypt(str: string) {
  return crypto.decrypt(str);
}

export function token(req, res) {
  return res.status(200).send(descypt(req.params.token));
}
export function root(req, res) {
  return res.status(200).send(descypt(req.query.token));
}
