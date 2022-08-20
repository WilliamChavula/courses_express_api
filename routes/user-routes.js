import express from "express";
import { body } from "express-validator";

import {
	createNewUser,
	getAllUsers,
	userById,
	getUserById,
	updateUserById,
	deleteUserById,
} from "../controllers/user-controllers.js";
import { validate } from "../middleware/user-input-validation-middleware.js";
import { verifyToken, checkAuthorized } from "../middleware/auth-middleware.js";

const userRouter = express.Router();

const sanitizers = [
	body("firstName").not().isEmpty().trim().escape(),
	body("lastName").not().isEmpty().trim().escape(),
	body("password").isLength({ min: 5 }).not().isEmpty(),
	body("email").isEmail().normalizeEmail(),
	body("jobTitle").not().isEmpty().trim().escape(),
];

userRouter.param("id", userById);

userRouter
	.route("/")
	.get(getAllUsers)
	.post(validate(sanitizers), verifyToken, checkAuthorized, createNewUser);
userRouter
	.route("/:id")
	.get(getUserById)
	.put(verifyToken, checkAuthorized, updateUserById)
	.delete(verifyToken, checkAuthorized, deleteUserById);

export default userRouter;
