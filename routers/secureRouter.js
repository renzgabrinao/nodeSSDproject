const express = require("express")
const secureRouter = express.Router()
const SecureController = require("../controllers/SecureController")
secureRouter.get("/secure-area", SecureController.Index)
secureRouter.get("/secure-users", SecureController.Users)
secureRouter.get("/:id", SecureController.UserDetail)
secureRouter.get("/edit/:id", SecureController.Edit)
secureRouter.post("/edit/:id", SecureController.EditUser)
secureRouter.post("/comment/:id", SecureController.AddComment)
secureRouter.get("/deleteComment/:commentId&:userId", SecureController.DeleteComment)
secureRouter.get("/delete/:id", SecureController.Delete)

module.exports = secureRouter;

