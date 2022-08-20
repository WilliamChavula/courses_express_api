import mongoose from "mongoose";

const { Schema } = mongoose;

const SubjectSchema = new Schema(
	{
		title: {
			type: String,
			required: ["true", "Subject title cannot be empty"],
			trim: true,
		},
		slug: {
			type: String,
			required: ["true", "Module slug cannot be empty"],
			trim: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Subject", SubjectSchema);
