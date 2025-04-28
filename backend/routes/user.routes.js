import express from "express";
import { registration,login,isAuth,logout } from "../controller/user.controller.js";
import authUser from "../middlewares/authUser.js";

const router=express.Router();

router.route("/register").post(registration);
router.route("/login").post(login);
router.route("/is-auth").get(authUser,isAuth);
router.route("/logout").get(authUser,logout);

export default router;


