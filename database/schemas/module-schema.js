import mongoose from "mongoose";

const { Schema } = mongoose;

const ModuleSchema = new Schema(
	{
		title: {
			type: String,
			required: ["true", "Module title cannot be empty"],
			trim: true,
		},
		description: {
			type: String,
			required: ["true", "Module description cannot be empty"],
			trim: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Module", ModuleSchema);
