import express from "express";

import {
	courseById,
	createCourse,
	getCourses,
	getCourseById,
	updateCourseById,
	deleteCourseById,
} from "../controllers/course-controller.js";

import { verifyToken, checkAuthorized } from "../middleware/auth-middleware.js";

const courseRouter = express.Router();

courseRouter.param("id", courseById);

courseRouter
	.route("/")
	.get(getCourses)
	.post(verifyToken, checkAuthorized, createCourse);
courseRouter
	.route("/:id")
	.get(getCourseById)
	.put(verifyToken, checkAuthorized, updateCourseById)
	.delete(verifyToken, checkAuthorized, deleteCourseById);

export default courseRouter;
