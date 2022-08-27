import express from "express";

import {
    moduleById,
    createModule,
    getModules,
    getModuleById,
    updateModuleById,
    deleteModuleById,
} from "../controllers/module-controller.js";
import { verifyToken, checkAuthorized } from "../middleware/auth-middleware.js";

const moduleRouter = express.Router();

moduleRouter.param("id", moduleById);
moduleRouter
    .route("/")
    .get(getModules)
    .post(verifyToken, checkAuthorized, createModule);

moduleRouter
    .route("/:id")
    .get(getModuleById)
    .put(verifyToken, checkAuthorized, updateModuleById)
    .delete(verifyToken, checkAuthorized, deleteModuleById);

export default moduleRouter;
