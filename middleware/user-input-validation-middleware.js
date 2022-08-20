import { validationResult } from "express-validator";

import { dispatchErrorResponseMessage } from "../controllers/utilities/response-messages.js";

export const validate = validations => {
	return async (req, res, next) => {
		await Promise.all(validations.map(validation => validation.run(req)));

		const errors = validationResult(req);
		if (errors.isEmpty()) {
			return next();
		}

		dispatchErrorResponseMessage(res, {
			message: { errors: errors.array() },
		});
		res.status(400).json();
	};
};
