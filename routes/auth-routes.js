import express from "express";
import { body } from "express-validator";

import { signIn, signUp, signOut } from "../controllers/auth-controller";
import { validate } from "../middleware/user-input-validation-middleware";

const authRouter = express.Router();

const sanitizers = [
    body("firstName").not().isEmpty().trim().escape(),
    body("lastName").not().isEmpty().trim().escape(),
    body("password").isLength({ min: 5 }).not().isEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("jobTitle").not().isEmpty().trim().escape(),
];

authRouter.post("/sign-in", signIn);
authRouter.post("/sign-up", validate(sanitizers), signUp);
authRouter.get("/sign-out", signOut);

export default authRouter;
