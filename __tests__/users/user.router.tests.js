import bcrypt from "bcryptjs";

import request from "supertest";

import app from "../../app.js";
import User from "../../database/schemas/user-schema.js";

import { makeUser } from "../../testUtils/fixtures.js";

afterEach(() => {
	// restore the spy created with spyOn
	jest.restoreAllMocks();
});

describe("User Controller Tests", () => {
	describe("GET endpoints Tests", () => {
		test("should make GET request returning all users", async () => {
			const users = [makeUser(), makeUser(), makeUser()];

			const mockFind = jest
				.spyOn(User, "find")
				.mockImplementationOnce(() => ({
					select: jest.fn().mockReturnThis(),
					exec: jest.fn().mockResolvedValueOnce(users),
				}));

			const response = await request(app).get("/users");

			expect(response.statusCode).toBe(200);
			expect(response.body["body"]).toHaveLength(3);
			expect(mockFind).toHaveBeenCalledTimes(1);
		});

		test("should make GET request to fetch a single user returning status 200", async () => {
			const user = makeUser();

			const mockFindById = jest
				.spyOn(User, "findById")
				.mockImplementationOnce(() => ({
					select: jest.fn().mockReturnThis(),
					exec: jest.fn().mockResolvedValueOnce(user),
				}));

			const response = await request(app).get(`/users/${user._id}`);

			expect(response.statusCode).toBe(200);
			expect(mockFindById).toHaveBeenCalledTimes(1);
		});

		test("should make GET request to fetch a single user returning status 404", async () => {
			const user = makeUser();

			const mockFindById = jest
				.spyOn(User, "findById")
				.mockImplementationOnce(() => ({
					select: jest.fn().mockReturnThis(),
					exec: jest.fn().mockResolvedValueOnce(null),
				}));

			const response = await request(app).get(`/users/${user._id}`);

			expect(response.statusCode).toBe(404);
			expect(response.body.message).toContain(user._id);
			expect(mockFindById).toHaveBeenCalledTimes(1);
		});
	});

	describe("POST, PUT, DELETE request tests", () => {
		let bcryptSpy, mockFindOne, mockFindById, loginResponse;
		const superUser = { ...makeUser(), isSuper: true };

		beforeEach(async () => {
			bcryptSpy = jest.spyOn(bcrypt, "compare").mockReturnValue(true);

			mockFindOne = jest
				.spyOn(User, "findOne")
				.mockImplementation(() => ({
					exec: jest.fn().mockResolvedValue(superUser),
				}));

			mockFindById = jest
				.spyOn(User, "findById")
				.mockImplementation(() => ({
					select: jest.fn().mockReturnThis(),
					exec: jest.fn().mockResolvedValue(superUser),
				}));

			loginResponse = await request(app)
				.post("/sign-in")
				.send({ email: superUser.email, password: superUser.password })
				.set("Accept", "application/json");
		});

		test("should make POST request, create a user returning status 201", async () => {
			const newUser = makeUser();

			const mockCreateSpy = jest
				.spyOn(User, "create")
				.mockReturnValueOnce(newUser);

			const { token } = loginResponse.body.body;

			const createResponse = await request(app)
				.post("/users")
				.send(newUser)
				.set("Accept", "application/json")
				.set("Authorization", `Bearer ${token}`);

			expect(createResponse.statusCode).toBe(201);
			expect(mockCreateSpy).toHaveBeenCalledTimes(1);
			expect(bcryptSpy).toHaveBeenCalled();

			expect(mockFindOne).toHaveBeenCalledTimes(1);
			expect(mockFindOne).toHaveBeenCalledWith(
				expect.objectContaining({ email: superUser.email }),
				"_id password"
			);

			expect(mockFindById).toHaveBeenCalledTimes(1);
			expect(mockFindById).toHaveBeenCalledWith(
				expect.objectContaining({
					_id: superUser._id,
				})
			);
		});

		test("should should make PUT request, update user returning status 200", async () => {
			const mockFindByIdAndUpdate = jest
				.spyOn(User, "findByIdAndUpdate")
				.mockImplementationOnce(() => ({
					exec: jest.fn().mockResolvedValueOnce({
						...superUser,
						firstName: "Updated",
					}),
				}));

			const { token } = loginResponse.body.body;

			const updateResponse = await request(app)
				.put(`/users/${superUser._id}`)
				.set("Authorization", `Bearer ${token}`)
				.set("Accept", "application/json")
				.send({ firstName: "Updated" });

			expect(updateResponse.body.body.firstName).toBe("Updated");
			expect(mockFindById).toHaveBeenCalled();
			expect(mockFindByIdAndUpdate).toHaveBeenCalled();
			expect(updateResponse.statusCode).toBe(200);
		});

		test("should should make DELETE request, update user returning status 204", async () => {
			const mockfindByIdAndDelete = jest
				.spyOn(User, "findByIdAndDelete")
				.mockImplementationOnce(() => ({
					exec: jest.fn().mockResolvedValue(null),
				}));

			const { token } = loginResponse.body.body;

			const deleteResponse = await request(app)
				.delete(`/users/${superUser._id}`)
				.set("Authorization", `Bearer ${token}`)
				.set("Accept", "application/json");

			expect(mockfindByIdAndDelete).toHaveBeenCalled();
			expect(deleteResponse.statusCode).toBe(204);
		});
	});
});
