// noinspection DuplicatedCode

import request from "supertest";
import bcrypt from "bcryptjs";

import app from "../../app";
import { makeSubject, makeUser } from "../../testUtils/fixtures";

import Subject from "../../database/schemas/subject-schema";
import User from "../../database/schemas/user-schema";

describe("course subject route tests", () => {
    describe("subject safe http methods endpoint tests", () => {
        let subject;

        beforeEach(() => {
            subject = makeSubject();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        test("should make GET request, retrieve all subjects, returning status 200 OK", async () => {
            const subjectFindSpy = jest
                .spyOn(Subject, "find")
                .mockImplementationOnce(() => ({
                    select: jest.fn().mockReturnThis(),
                    exec: jest.fn().mockResolvedValueOnce(subject),
                }));

            const response = await request(app).get("/subjects");

            expect(response.statusCode).toBe(200);
            expect(subjectFindSpy).toHaveBeenCalledTimes(1);
        });

        test("should make GET request, retrieve  subject by ID, returning status 200 OK", async () => {
            const subjectFindByIdSpy = jest
                .spyOn(Subject, "findById")
                .mockImplementationOnce(() => ({
                    select: jest.fn().mockReturnThis(),
                    exec: jest.fn().mockResolvedValueOnce(subject),
                }));

            const response = await request(app).get(`/subjects/${subject._id}`);

            expect(response.statusCode).toBe(200);
            expect(subjectFindByIdSpy).toHaveBeenCalledTimes(1);
        });
    });
    describe("subject unsafe http methods endpoint tests", () => {
        let superUser,
            subject,
            bcryptSpy,
            mockFindOne,
            mockFindById,
            moduleCreateSpy,
            moduleFindByIdSpy,
            loginResponse,
            authToken;

        beforeEach(async () => {
            superUser = { ...makeUser(), isSuper: true };
            subject = makeSubject();
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
                .spyOn(Subject, "create")
                .mockResolvedValueOnce(subject);

            moduleFindByIdSpy = jest
                .spyOn(Subject, "findById")
                .mockImplementationOnce(() => ({
                    select: jest.fn().mockReturnThis(),
                    exec: jest.fn().mockResolvedValueOnce(subject),
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

        test("should make POST request, create a subject, returning status 201 CREATED", async () => {
            const response = await request(app)
                .post("/subjects")
                .send(subject)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.statusCode).toBe(201);
            expect(bcryptSpy).toHaveBeenCalledTimes(1);
            expect(mockFindOne).toHaveBeenCalledTimes(1);
            expect(mockFindById).toHaveBeenCalledTimes(1);
            expect(moduleCreateSpy).toHaveBeenCalledTimes(1);
        });

        test("should make PUT request, update subject, returning status 200 OK", async () => {
            const subjectfindByIdAndUpdateSpy = jest
                .spyOn(Subject, "findByIdAndUpdate")
                .mockImplementationOnce(() => ({
                    exec: jest.fn().mockResolvedValueOnce({
                        ...subject,
                        title: "updated Title",
                    }),
                }));

            const response = await request(app)
                .put(`/subjects/${subject._id}`)
                .send({
                    ...subject,
                    title: "updated Title",
                })
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${authToken}`);

            expect(response.statusCode).toBe(200);
            expect(subjectfindByIdAndUpdateSpy).toHaveBeenCalledTimes(1);
        });

        test("should make DELETE request, delete a module, returning status 204 NO CONTENT", async () => {
            const subjectfindByIdAndDeleteSpy = jest
                .spyOn(Subject, "findByIdAndDelete")
                .mockImplementationOnce(() => ({
                    exec: jest.fn().mockResolvedValueOnce(null),
                }));

            const response = await request(app)
                .delete(`/subjects/${subject._id}`)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${authToken}`);

            expect(subjectfindByIdAndDeleteSpy).toHaveBeenCalledTimes(1);
            expect(response.statusCode).toBe(204);
        });
    });
});
