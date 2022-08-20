import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../database/schemas/user-schema.js";
import {
	dispatchErrorResponseMessage,
	dispatchLoginResponseMessage,
	dispatchModifyResponseMessage,
} from "./utilities/response-messages.js";

export const signIn = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			const message = "Please provide both Email and password to login";
			return dispatchErrorResponseMessage(res, {
				message,
				statusCode: 400,
			});
		}

		const user = await User.findOne({ email }, "_id password").exec();

		if (!user)
			return dispatchErrorResponseMessage(res, {
				statusCode: 404,
				message: "No user found matching the provided details",
			});

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect)
			return dispatchErrorResponseMessage(res, { statusCode: 400 });

		const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});
		res.cookie("t", token, { expiresIn: "1h", httpOnly: true });

		return dispatchLoginResponseMessage(res, { body: { token } });
	} catch (err) {
		dispatchErrorResponseMessage(res, { message: err.message });
	}
};

export const signUp = async (req, res) => {
	try {
		const { id, firstName, lastName, email, password, jobTitle, isSuper } =
			req.body;

		const user = await User.create({
			_id: id,
			firstName,
			lastName,
			email,
			password,
			jobTitle,
			isSuper,
		});

		if (!user)
			return dispatchErrorResponseMessage(res, { message: err.message });

		user["__v"] = undefined;
		user["password"] = undefined;
		user["salt"] = undefined;

		return dispatchModifyResponseMessage(res, {
			body: user,
			statusCode: 201,
		});
	} catch (err) {
		dispatchErrorResponseMessage(res, { message: err.message });
	}
};

export const signOut = async (req, res) => {
	res.clearCookie("t");

	return dispatchModifyResponseMessage(res, {
		body: { message: "Signed out successfully" },
	});
};
