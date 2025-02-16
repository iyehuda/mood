import { createApp } from "../src/app";
import request from "supertest";

const app = createApp();

describe("GET /hello/world", () => {
  it("should return a greeting message", async () => {
    const response = await request(app).get("/hello/world");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello World!");
  });
});

describe("GET /hello/version", () => {
  it("should return the app version", async () => {
    const response = await request(app).get("/hello/version");

    expect(response.status).toBe(200);
    expect(response.text).toBe("1.0.0");
  });
});
