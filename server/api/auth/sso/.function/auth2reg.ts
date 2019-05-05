import regData from "@regchula/index";

export default async function(username: string, password: string, { cr60, regdoc, pinfo }) {
  return await regData(username, password, { cr60, regdoc, pinfo });
}
