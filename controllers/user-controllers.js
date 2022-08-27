import User from "../database/schemas/user-schema";
import {
    dispatchErrorResponseMessage,
    dispatchFetchDocumentResponseMessage,
    dispatchModifyResponseMessage,
} from "./utilities/response-messages";

export const userById = async (req, res, next, userId) => {
    try {
        const user = await User.findById(userId)
            .select("-password -salt -__v")
            .exec();

        if (!user) {
            const message = `User with id: ${userId} could not be found`;
            return dispatchErrorResponseMessage(res, {
                message,
                statusCode: 404,
            });
        }

        req.user = user;

        next();
    } catch (err) {
        dispatchErrorResponseMessage(res, { message: err.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password -salt -__v").exec();

        return dispatchFetchDocumentResponseMessage(res, users);
    } catch (err) {
        dispatchErrorResponseMessage(res, { message: err.message });
    }
};

export const getUserById = async (req, res) => {
    const user = req.user;

    if (!user) {
        dispatchErrorResponseMessage(res, { statusCode: 404 });
    }

    return dispatchFetchDocumentResponseMessage(res, user);
};

export const createNewUser = async (req, res) => {
    const {
        _id: id,
        firstName,
        lastName,
        email,
        jobTitle,
        password,
        isSuper,
    } = req.body;

    try {
        const user = await User.create({
            _id: id,
            firstName,
            lastName,
            email,
            jobTitle,
            password,
            isSuper,
        });

        if (!user) return dispatchErrorResponseMessage(res);

        user.password = undefined;
        user.salt = undefined;
        user["__v"] = undefined;

        return dispatchModifyResponseMessage(res, {
            body: user,
            statusCode: 201,
        });
    } catch (err) {
        dispatchErrorResponseMessage(res, { message: err.message });
    }
};

export const updateUserById = async (req, res) => {
    const { user, body } = req;

    if (!user) return dispatchErrorResponseMessage(res, { statusCode: 404 });

    try {
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                ...body,
            },
            { new: true }
        ).exec();

        if (!updatedUser) return dispatchErrorResponseMessage(res);

        updatedUser.password = undefined;
        updatedUser.salt = undefined;
        updatedUser["__v"] = undefined;

        return dispatchModifyResponseMessage(res, { body: updatedUser });
    } catch (err) {
        dispatchErrorResponseMessage(res, { message: err.message });
    }
};

export const deleteUserById = async (req, res) => {
    const { user } = req;

    if (!user) return dispatchErrorResponseMessage(res);

    try {
        await User.findByIdAndDelete(user._id).exec();
        return dispatchModifyResponseMessage(res, {
            body: null,
            statusCode: 204,
        });
    } catch (err) {
        dispatchErrorResponseMessage(res);
    }
};
