import Course from "../database/schemas/course-schema.js";
import Subject from "../database/schemas/subject-schema.js";
import Module from "../database/schemas/module-schema.js";

import {
	dispatchErrorResponseMessage,
	dispatchFetchDocumentResponseMessage,
	dispatchModifyResponseMessage,
} from "./utilities/response-messages.js";

export const courseById = async (req, res, next, courseId) => {
	const course = await Course.findById(courseId)
		.populate({ path: "module", select: "-__v" })
		.populate({ path: "subject", select: "-__v" })
		.exec();

	if (!course) {
		const message = `Course with id: ${courseId} could not be found`;
		return dispatchErrorResponseMessage(res, { message, statusCode: 404 });
	}

	req.course = course;

	next();
};

export const createCourse = async (req, res) => {
	const { body } = req;
	const { module: moduleBody, subject: subjectBody } = body;

	try {
		// const subject = await Subject.create({
		// 	title: subjectBody["title"],
		// 	slug: subjectBody["slug"],
		// });

		// const module = await Module.create({
		// 	title: moduleBody["title"],
		// 	description: moduleBody["description"],
		// });

		const [subject, module] = await Promise.all([
			Subject.create({
				title: subjectBody["title"],
				slug: subjectBody["slug"],
			}),
			Module.create({
				title: moduleBody["title"],
				description: moduleBody["description"],
			}),
		]);

		if (subject && module) {
			const course = await Course.create({
				title: body["title"],
				lecturer: body["owner"],
				slug: body["slug"],
				overview: body["overview"],
				module: module._id,
				subject: subject._id,
			});

			if (!course) return dispatchErrorResponseMessage(res);

			course["__v"] = undefined;

			return dispatchModifyResponseMessage(res, {
				body: course,
				statusCode: 201,
			});
		}
	} catch (err) {
		dispatchErrorResponseMessage(res, { message: err.message });
	}
};

export const getCourses = async (req, res) => {
	try {
		const courses = await Course.find()
			.select("-__v")
			.populate({ path: "module", select: "-__v" })
			.populate({ path: "subject", select: "-__v" })
			.exec();

		return dispatchFetchDocumentResponseMessage(res, courses);
	} catch (err) {
		dispatchErrorResponseMessage(res);
	}
};

export const getCourseById = async (req, res) => {
	const { course } = req;

	try {
		if (!course)
			return dispatchErrorResponseMessage(res, {
				statusCode: 404,
			});

		return dispatchFetchDocumentResponseMessage(res, course);
	} catch (err) {
		dispatchErrorResponseMessage(res);
	}
};

export const updateCourseById = async (req, res) => {
	const { course, body } = req;

	try {
		if (body["module"]) {
			await Module.findByIdAndUpdate(course.module._id, {
				...body["module"],
			}).exec();
		}

		if (body["subject"]) {
			await Subject.findByIdAndUpdate(course.subject._id, {
				...body["subject"],
			}).exec();
		}

		for (let key of Object.keys(body)) {
			if (key === "subject" || key === "module") continue;
			course[key] = body[key];
		}

		const updated = await course.save();

		if (!updated) return dispatchErrorResponseMessage(res);

		const updatedCourse = await Course.findById(course._id)
			.populate({ path: "module", select: "-__v" })
			.populate({ path: "subject", select: "-__v" })
			.exec();

		return dispatchModifyResponseMessage(res, {
			body: updatedCourse,
		});
	} catch (err) {
		dispatchErrorResponseMessage(res, { message: err.message });
	}
};

export const deleteCourseById = async (req, res) => {
	try {
		const { course } = req;

		if (!course)
			return dispatchErrorResponseMessage(res, {
				statusCode: 404,
			});

		// if (course.module) {
		// 	await Module.findByIdAndDelete(course.module._id).exec();
		// }

		// if (course.subject) {
		// 	await Subject.findByIdAndDelete(course.subject._id).exec();
		// }

		// await Course.findByIdAndDelete(course._id).exec();

		await Promise.all([
			Module.findByIdAndDelete(course.module._id),
			Subject.findByIdAndDelete(course.subject._id),
			Course.findByIdAndDelete(course._id),
		]);

		return dispatchModifyResponseMessage(res, {
			statusCode: 204,
			body: null,
		});
	} catch (err) {
		return dispatchErrorResponseMessage(res);
	}
};
