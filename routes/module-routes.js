import express from "express";

import {
	moduleById,
	createModule,
	getModules,
	getModuleById,
	updateModulebyId,
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
	.put(verifyToken, checkAuthorized, updateModulebyId)
	.delete(verifyToken, checkAuthorized, deleteModuleById);

export default moduleRouter;
