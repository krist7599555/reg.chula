import regData from "@regchula/index";

export default async function(username: string, password: string) {
  return (await regData(username, password, { cr60: true })).cr60;
}
