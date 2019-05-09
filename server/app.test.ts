import "jest-extended";
import * as request from "supertest";
import { app } from "./app";

const username = process.env.REG_username;
const password = process.env.REG_password;

describe("/api", function() {
  test("API", async () => {
    const response = await request(app.callback()).get("/api");
    expect(response.status).toBe(200);
  });
});

describe("/auth/sso", function() {
  test("right password", async () => {
    const res = await request(app.callback())
      .post("/api/login")
      .send({ username, password });
    // expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty("ticket");
    const res2 = await request(app.callback())
      .get("/api/profile")
      .set("Cookie", res.header["set-cookie"][0]);
    expect(res2.status).toBe(200);
    expect(res2.body).toContainKeys(["ouid", "nameTH", "surnameTH"]);
    expect(res2.body).not.toContainAnyKeys(["pwid", "_id", "ticket"]);
  });

  test("wrong password", async () => {
    const res = await request(app.callback())
      .post("/api/login")
      .send({ username, password: "wrong_password" });
    expect(res.status).toBe(401);
    const res2 = await request(app.callback()).get("/api/profile");
    expect(res2.status).toBe(401);
  });
});
