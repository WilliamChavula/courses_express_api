import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const ROUNDS = 16;

const UserSchema = new Schema(
	{
		_id: String,
		firstName: { type: String, trim: true, required: true, minLength: 3 },
		lastName: { type: String, trim: true, required: true, minLength: 3 },
		email: {
			type: String,
			index: true,
			lowercase: true,
			trim: true,
			required: true,
			unique: true,
			match: [
				/^[a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/,
				"Please fill a valid email address",
			],
		},
		password: { type: String, required: true, minLength: 5 },
		salt: String,
		jobTitle: { type: String, required: true, minLength: 3 },
		isSuper: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

UserSchema.pre("save", async function (next) {
	const user = this;

	if (this.isModified("password") || this.isNew) {
		if (user.password.length < 5) {
			user.invalidate(
				"password",
				"Password must contain at least 5 characters"
			);
		}
		try {
			user.salt = await bcrypt.genSalt(ROUNDS);
			const hash = await bcrypt.hash(user.password, user.salt);
			user.password = hash;
			next();
		} catch (err) {
			return next(err);
		}
	} else {
		return next();
	}
});

UserSchema.methods.authenticate = async function (password) {
	try {
		const isMatch = await bcrypt.compare(password, this.password);
		return isMatch;
	} catch (err) {
		throw new Error(err);
	}
};

export default mongoose.model("User", UserSchema);
