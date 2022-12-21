const express = require("express");
const userRouter = express.Router();
const UserController = require("../controllers/UserController");
userRouter.get("/register", UserController.Register);
userRouter.post("/register", UserController.RegisterUser);
userRouter.get("/login", UserController.Login);
userRouter.post("/login", UserController.LoginUser);
userRouter.get("/logout", UserController.Logout);
module.exports = userRouter;

