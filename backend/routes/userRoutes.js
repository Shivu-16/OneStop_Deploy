import express from "express";
import { login, register, logout, getUser, updateUserProfile } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);
router.put("/update/:id", isAuthenticated, updateUserProfile);
///router.post("/newCompany",newCompany)

export default router;
