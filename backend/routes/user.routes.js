import express from "express";
import { registration,login,logout } from "../controller/user.controller.js";

const router=express.Router();

router.route("/register").post(registration);
router.route("/login").post(login);
router.route("/logout").get(logout);

export default router;


