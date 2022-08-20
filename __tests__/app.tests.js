import request from "supertest";

import app from "../app.js";

describe("Test App endpoint", () => {
	test("Should make GET request to /home", async () => {
		const response = await request(app).get("/home");

		expect(response.statusCode).toEqual(200);
		expect(response.body).toEqual("Hello World");
	});
});
