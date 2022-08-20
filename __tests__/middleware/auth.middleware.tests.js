import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import request from "supertest";

import app from "../../app.js";
import User from "../../database/schemas/user-schema.js";

import { makeUser } from "../../testUtils/fixtures.js";

afterEach(() => {
	// restore the spy created with spyOn
	jest.restoreAllMocks();
});

describe("Authetication and Authorization Middleware Tests", () => {
	test("should attempt CREATE request with no token, returning status 401", async () => {
		const newUser = makeUser();

		const createResponse = await request(app)
			.post("/users")
			.send(newUser)
			.set("Accept", "application/json");

		expect(createResponse.statusCode).toBe(401);
		expect(createResponse.headers["www-authenticate"]).toContain("Bearer");
		expect(createResponse.body.message).toContain("credentials");
	});

	test("should attempt CREATE request with non-supeUser token, returning status 403", async () => {
		const notSuperUser = { ...makeUser(), isSuper: false };
		const newUser = makeUser();

		jest.spyOn(bcrypt, "compare").mockReturnValueOnce(true);

		jest.spyOn(User, "findOne").mockImplementationOnce(() => ({
			exec: jest.fn().mockResolvedValueOnce(notSuperUser),
		}));

		const mockFindById = jest
			.spyOn(User, "findById")
			.mockImplementationOnce(() => ({
				exec: jest.fn().mockResolvedValueOnce(notSuperUser),
			}));

		jest.spyOn(User, "create").mockReturnValueOnce(newUser);

		const loginResponse = await request(app)
			.post("/sign-in")
			.send({
				email: notSuperUser.email,
				password: notSuperUser.password,
			})
			.set("Accept", "application/json");

		const { token } = loginResponse.body.body;

		const createResponse = await request(app)
			.post("/users")
			.send(newUser)
			.set("Accept", "application/json")
			.set("Authorization", `Bearer ${token}`);

		expect(createResponse.statusCode).toBe(403);
		expect(mockFindById).toHaveBeenCalled();
	});
});
