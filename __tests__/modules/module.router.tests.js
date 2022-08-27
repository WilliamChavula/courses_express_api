// noinspection DuplicatedCode

import bcrypt from "bcryptjs";
import request from "supertest";

import app from "../../app";
import { makeModule, makeUser } from "../../testUtils/fixtures";

import Module from "../../database/schemas/module-schema";
import User from "../../database/schemas/user-schema";

describe("course module Tests", () => {
    describe("module safe http methods endpoint tests", () => {
        let module;

        beforeEach(() => {
            module = makeModule();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        test("should make GET request fetching all modules, returning status 200 OK", async () => {
            const moduleFindSpy = jest
                .spyOn(Module, "find")
                .mockImplementationOnce(() => ({
                    select: jest.fn().mockReturnThis(),
                    exec: jest.fn().mockResolvedValueOnce(module),
                }));

            const response = await request(app).get("/modules");

            expect(response.statusCode).toBe(200);
            expect(response.body.body).toStrictEqual(
                expect.objectContaining(module)
            );
            expect(moduleFindSpy).toHaveBeenCalledTimes(1);
        });

        test("should make GET request, fetch module by id, returning status 200 OK", async () => {
            const moduleFindByIdSpy = jest
                .spyOn(Module, "findById")
                .mockImplementationOnce(() => ({
                    select: jest.fn().mockReturnThis(),
                    exec: jest.fn().mockResolvedValueOnce(module),
                }));

            const response = await request(app).get(`/modules/${module._id}`);

            expect(response.statusCode).toBe(200);
            expect(moduleFindByIdSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("module unsafe http methods endpoints tests", () => {
        let superUser,
            module,
            bcryptSpy,
            mockFindOne,
            mockFindById,
            moduleCreateSpy,
            moduleFindByIdSpy,
            loginResponse,
            authToken;

        beforeEach(async () => {
            superUser = { ...makeUser(), isSuper: true };
            module = makeModule();
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

            moduleCreateSpy = jest
                .spyOn(Module, "create")
                .mockResolvedValueOnce(module);

            moduleFindByIdSpy = jest
                .spyOn(Module, "findById")
                .mockImplementationOnce(() => ({
                    select: jest.fn().mockReturnThis(),
                    exec: jest.fn().mockResolvedValueOnce(module),
                }));

            loginResponse = await request(app)
                .post("/sign-in")
                .send({ email: superUser.email, password: superUser.password })
                .set("Accept", "application/json");

            const {
                body: { token },
            } = loginResponse.body;
            authToken = token;
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        test("should make POST request, create a module, returning status 201 CREATED", async () => {
            const response = await request(app)
                .post("/modules")
                .send(module)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.statusCode).toBe(201);
            expect(bcryptSpy).toHaveBeenCalledTimes(1);
            expect(mockFindOne).toHaveBeenCalledTimes(1);
            expect(mockFindById).toHaveBeenCalledTimes(1);
            expect(moduleCreateSpy).toHaveBeenCalledTimes(1);
        });

        test("should make PUT request, update module, returning status 200 OK", async () => {
            const moduleFindByIdAndUpdateSpy = jest
                .spyOn(Module, "findByIdAndUpdate")
                .mockImplementationOnce(() => ({
                    exec: jest.fn().mockResolvedValueOnce({
                        ...module,
                        title: "updated Title",
                    }),
                }));

            const response = await request(app)
                .put(`/modules/${module._id}`)
                .send({ ...module, title: "updated Title" })
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.statusCode).toBe(200);
            expect(moduleFindByIdAndUpdateSpy).toHaveBeenCalledTimes(1);
        });

        test("should make DELETE request, delete a module, returning status 204 NO CONTENT", async () => {
            const moduleFindByIdAndDeleteSpy = jest
                .spyOn(Module, "findByIdAndDelete")
                .mockImplementationOnce(() => ({
                    exec: jest.fn().mockResolvedValueOnce(null),
                }));

            const response = await request(app)
                .delete(`/modules/${module._id}`)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${authToken}`);

            expect(moduleFindByIdAndDeleteSpy).toHaveBeenCalledTimes(1);
            expect(response.statusCode).toBe(204);
        });
    });
});
