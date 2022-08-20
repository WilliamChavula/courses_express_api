import mongoose from "mongoose";

const { Schema } = mongoose;

const CourseSchema = new Schema(
	{
		title: {
			type: String,
			required: ["true", "Course title cannot be empty"],
			trim: true,
		},
		slug: {
			type: String,
			required: ["true", "Course slug cannot be empty"],
			trim: true,
		},
		overview: {
			type: String,
			required: ["true", "Course overview cannot be empty"],
			trim: true,
		},
		module: { type: Schema.Types.ObjectId, ref: "Module" },
		subject: { type: Schema.Types.ObjectId, ref: "Subject" },
		lecturer: { type: String, ref: "User" },
	},
	{ timestamps: true }
);

export default mongoose.model("Course", CourseSchema);
