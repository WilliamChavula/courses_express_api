import express from "express";

import {
	subjectById,
	createSubject,
	getSubjects,
	getSubjectById,
	updateSubjectById,
	deleteSubjectById,
} from "../controllers/subject-controller.js";
import { verifyToken, checkAuthorized } from "../middleware/auth-middleware.js";

const subjectRouter = express.Router();

subjectRouter.param("id", subjectById);

subjectRouter
	.route("/")
	.get(getSubjects)
	.post(verifyToken, checkAuthorized, createSubject);
subjectRouter
	.route("/:id")
	.get(getSubjectById)
	.put(verifyToken, checkAuthorized, updateSubjectById)
	.delete(verifyToken, checkAuthorized, deleteSubjectById);

export default subjectRouter;
