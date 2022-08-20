import bcrypt from "bcryptjs";
import request from "supertest";

import app from "../../app.js";
import User from "../../database/schemas/user-schema.js";

afterEach(() => {
	// restore the spy created with spyOn
	jest.restoreAllMocks();
});

describe("Tests auth.router signIn and signUp endpoints", () => {
	test("should make POST request and sign up a user", async () => {
		const payload = {
			id: "b9177b51-0362-4074-bcac-eb772910958b",
			firstName: "Ammamaria",
			lastName: "Teck",
			email: "ateck0@angelfire.com",
			jobTitle: "Actuary",
			isSuper: "true",
			password: "NSIxpi",
		};

		const mockCreateSpy = jest.spyOn(User, "create").mockReturnValueOnce({
			id: "b9177b51-0362-4074-bcac-eb772910958b",
			firstName: "Ammamaria",
			lastName: "Teck",
			email: "ateck0@angelfire.com",
			jobTitle: "Actuary",
			isSuper: "true",
		});

		const response = await request(app)
			.post("/sign-up")
			.send(payload)
			.set("Accept", "application/json")
			.expect("Content-Type", /json/)
			.expect(201);

		expect(mockCreateSpy).toHaveBeenCalled();
		expect(response.body).not.toBeUndefined();
	});

	test("should make POST request and sign in a user", async () => {
		const payload = {
			email: "ateck0@angelfire.com",
			password: "NSIxpi",
		};

		const bcryptSpy = jest
			.spyOn(bcrypt, "compare")
			.mockReturnValueOnce(true);

		const mockFindOne = jest
			.spyOn(User, "findOne")
			.mockImplementationOnce(() => ({
				exec: jest.fn().mockResolvedValueOnce({
					_id: "b9177b51-0362-4074-bcac-eb772910958b",
					firstName: "Ammamaria",
					lastName: "Teck",
					email: "ateck0@angelfire.com",
					jobTitle: "Actuary",
					isSuper: "true",
				}),
			}));

		const response = await request(app)
			.post("/sign-in")
			.send(payload)
			.set("Accept", "application/json")
			.expect("Content-Type", /json/);

		expect(response.statusCode).toBe(200);
		expect(bcryptSpy).toHaveBeenCalled();
		expect(response.body).not.toBeUndefined();
		expect(mockFindOne).toHaveBeenCalledTimes(1);
	});

	test("should make GET request and sign out a user", async () => {
		const agent = request.agent(app);
		const response = await agent
			.get("/sign-out")
			.set("Cookie", ["t=sectureTokenFromBrowser"])
			.expect(200);

		expect(response.headers["set-cookie"][0]).toContain("t=;");
	});
});
