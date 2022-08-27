import Module from "../database/schemas/module-schema.js";
import {
    dispatchErrorResponseMessage,
    dispatchFetchDocumentResponseMessage,
    dispatchModifyResponseMessage,
} from "./utilities/response-messages.js";

export const moduleById = async (req, res, next, moduleId) => {
    try {
        const module = await Module.findById(moduleId).select("-__v").exec();

        if (!module) {
            const message = `Module with id: ${moduleId} could not be found`;

            return dispatchErrorResponseMessage(res, {
                message,
                statusCode: 404,
            });
        }

        req.module = module;

        next();
    } catch (err) {
        return dispatchErrorResponseMessage(res);
    }
};

export const createModule = async (req, res) => {
    const payload = req.body;

    try {
        const module = await Module.create({
            title: payload["title"],
            description: payload["description"],
        });

        if (!module) return dispatchErrorResponseMessage(res);

        module["__v"] = undefined;

        return dispatchModifyResponseMessage(res, {
            body: module,
            statusCode: 201,
        });
    } catch (err) {
        dispatchErrorResponseMessage(res);
    }
};

export const getModules = async (req, res) => {
    try {
        const modules = await Module.find().select("-__v").exec();

        return dispatchFetchDocumentResponseMessage(res, modules);
    } catch (err) {
        dispatchErrorResponseMessage(res);
    }
};

export const getModuleById = async (req, res) => {
    const { module } = req;

    try {
        if (!module)
            return dispatchErrorResponseMessage(res, {
                statusCode: 404,
            });

        return dispatchFetchDocumentResponseMessage(res, module);
    } catch (err) {
        dispatchErrorResponseMessage(res);
    }
};

export const updateModuleById = async (req, res) => {
    const { module, body } = req;
    try {
        if (!module)
            return dispatchErrorResponseMessage(res, {
                statusCode: 404,
            });

        const updated = await Module.findByIdAndUpdate(
            module._id,
            { ...body },
            { new: true }
        ).exec();

        if (!updated) return dispatchErrorResponseMessage(res);

        return dispatchModifyResponseMessage(res, { body: updated });
    } catch (err) {
        dispatchErrorResponseMessage(res, { message: err.message });
    }
};

export const deleteModuleById = async (req, res) => {
    try {
        const { module } = req;

        if (!module)
            return dispatchErrorResponseMessage(res, {
                statusCode: 404,
            });

        await Module.findByIdAndDelete(module._id).exec();

        return dispatchModifyResponseMessage(res, {
            statusCode: 204,
            body: null,
        });
    } catch (err) {
        return dispatchErrorResponseMessage(res);
    }
};
