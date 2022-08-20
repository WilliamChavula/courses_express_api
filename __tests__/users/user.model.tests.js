import mongoose from "mongoose";

import User from "../../database/schemas/user-schema.js";

const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

let payload, user;

beforeAll(() => {
	mongoose.connect(process.env.MONGODB_URL, {
		useUnifiedTopology: true,
		dbName: `${MONGO_DB_NAME}_test`,
	});
});

beforeEach(async () => {
	payload = {
		_id: "b9177b51-0362-4074-bcac-eb772910958b",
		firstName: "Ammamaria",
		lastName: "Teck",
		email: "ateck0@angelfire.com",
		jobTitle: "Actuary",
		isSuper: "true",
		password: "NSIxpi",
	};
	user = await User.create(payload);
});

afterEach(async () => {
	await User.deleteOne({ _id: user._id });
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe("Tests for the mongoDb User Model", () => {
	test("Should create a new user document in db hashing the password", async () => {
		expect(user._id).not.toBeNull();
		expect(user.createdAt).toBeDefined();
		expect(user.updatedAt).toBeDefined();
		expect(user.password).not.toEqual(payload.password);
	});

	test.skip("Should verify user password returning true", async () => {
		const checkPassword = await user.authenticate(payload.password);

		expect(checkPassword).toBeTruthy();
	});

	test.skip("Should verify wrong user password returning false", async () => {
		const checkPassword = await user.authenticate("password");

		expect(checkPassword).toBeFalsy();
	});

	test.each([
		{ password: "NSIxpi", expected: true },
		{ password: "password", expected: false },
	])("Should verify user password", async ({ password, expected }) => {
		const checkPassword = await user.authenticate(password);

		expect(checkPassword).toBe(expected);
	});
});
