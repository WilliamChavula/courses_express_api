import jwt from "jsonwebtoken";

import User from "../database/schemas/user-schema.js";
import { dispatchErrorResponseMessage } from "../controllers/utilities/response-messages.js";

export const verifyToken = (req, res, next) => {
	try {
		if (!req.headers.authorization) {
			res.set("WWW-Authenticate", "Bearer");

			return dispatchErrorResponseMessage(res, {
				statusCode: 401,
				message: "Could not validate credentials",
			});
		}

		const { authorization } = req.headers;
		const token = authorization.split(" ")[1];

		const { sub } = jwt.verify(token, process.env.JWT_SECRET);

		req.userId = sub;

		next();
	} catch (err) {
		dispatchErrorResponseMessage(res, {
			message: err.message,
			statusCode: 401,
		});
	}
};

export const checkAuthorized = async (req, res, next) => {
	try {
		const { userId } = req;
		const message = "Not authorized to perform requested operation";

		if (!userId)
			return dispatchErrorResponseMessage(req, {
				statusCode: 403,
				message,
			});

		const user = await User.findById({ _id: userId })
			.select("-password -salt -__v")
			.exec();

		if (!user || !user.isSuper)
			return dispatchErrorResponseMessage(req, {
				statusCode: 403,
				message,
			});

		next();
	} catch (err) {
		dispatchErrorResponseMessage(res, {
			message: err.message,
			statusCode: 403,
		});
	}
};
