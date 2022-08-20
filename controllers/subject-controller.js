import Subject from "../database/schemas/subject-schema.js";
import {
	dispatchErrorResponseMessage,
	dispatchFetchDocumentResponseMessage,
	dispatchModifyResponseMessage,
} from "./utilities/response-messages.js";

export const subjectById = async (req, res, next, subjectId) => {
	try {
		const subject = await Subject.findById(subjectId).select("-__v").exec();

		if (!subject) {
			const message = `Subject with id: ${subjectId} could not be found`;

			return dispatchErrorResponseMessage(res, {
				message,
				statusCode: 404,
			});
		}

		req.subject = subject;

		next();
	} catch (err) {
		dispatchErrorResponseMessage(res);
	}
};

export const createSubject = async (req, res) => {
	try {
		const { body } = req;

		const subject = await Subject.create({
			title: body["title"],
			slug: body["slug"],
		});

		if (!subject) return dispatchErrorResponseMessage(res);

		subject["__v"] = undefined;

		return dispatchModifyResponseMessage(res, {
			body: subject,
			statusCode: 201,
		});
	} catch (err) {
		dispatchErrorResponseMessage(res, { message: err.message });
	}
};

export const getSubjects = async (req, res) => {
	try {
		const subjects = await Subject.find().select("-__v").exec();

		return dispatchFetchDocumentResponseMessage(res, subjects);
	} catch (err) {
		dispatchErrorResponseMessage(res);
	}
};

export const getSubjectById = async (req, res) => {
	const { subject } = req;

	if (!subject) return dispatchErrorResponseMessage(res, { statusCode: 404 });

	return dispatchFetchDocumentResponseMessage(res, subject);
};

export const updateSubjectById = async (req, res) => {
	const { subject, body } = req;

	try {
		if (!subject)
			return dispatchErrorResponseMessage(res, { statusCode: 404 });

		const updated = await Subject.findByIdAndUpdate(
			subject._id,
			{
				...body,
			},
			{ new: true }
		).exec();

		if (!updated) return dispatchErrorResponseMessage(res);

		return dispatchModifyResponseMessage(res, { body: updated });
	} catch (err) {
		dispatchErrorResponseMessage(res);
	}
};

export const deleteSubjectById = async (req, res) => {
	const { subject } = req;

	try {
		if (!subject)
			return dispatchErrorResponseMessage(res, { statusCode: 404 });

		await Subject.findByIdAndDelete(subject._id).exec();

		return dispatchModifyResponseMessage(res, {
			body: null,
			statusCode: 204,
		});
	} catch (err) {
		dispatchErrorResponseMessage(res);
	}
};
