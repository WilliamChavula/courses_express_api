export const dispatchFetchDocumentResponseMessage = (
	res,
	body,
	{ statusCode = 200 } = {}
) =>
	res.status(statusCode).json({
		body,
	});

export const dispatchErrorResponseMessage = (
	res,
	{
		message = "The requested operation failed to complete successfully",
		statusCode = 400,
	} = {}
) =>
	res.status(statusCode).json({
		message,
	});

export const dispatchModifyResponseMessage = (
	res,
	{ body, statusCode = 200 } = {}
) =>
	res.status(statusCode).json({
		message: "Operation completed successfully",
		body,
	});

export const dispatchLoginResponseMessage = (
	res,
	{ body, statusCode = 200 } = {}
) =>
	res.status(statusCode).json({
		message: "Successfully logged in",
		body,
	});
