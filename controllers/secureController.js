const path = require("path")
const User = require("../models/User.js")
const UserOps = require("../data/userOps.js")
const _userOps = new UserOps();

const RequestService = require("../services/RequestService");
const { response } = require("express");
const { use } = require("passport");
const _ = require("passport-local-mongoose");

exports.Index = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    if (reqInfo.authenticated) {
        return res.render("secure/secure-area", { reqInfo: reqInfo });
    } else {
        res.redirect(
            "/user/login?errorMessage=You must be logged in to view this page."
        );
    }
};

exports.Users = async function (req, res) {
    let users = null;
    let reqInfo = RequestService.reqHelper(req);

    if (req.query.search) {
        users = await _userOps.getUsersBySearch(req.query.search)
    } else {
        users = await _userOps.getAllUsers()
    }

    if (reqInfo.authenticated) {
        let currentUser = await _userOps.getUserById(reqInfo.id)
        if(users) {
            res.render("../views/secure/secure-users.ejs", {
                users: users,
                currentUser: currentUser,
                reqInfo: reqInfo,
                search: req.query.search,
                message: ""
            })
        } else {
            res.render("../views/secure/secure-users.ejs", {
                users: [],
                reqInfo: reqInfo,
                search: req.query.search,
                message: ""
            })
        }
    } else {
    res.redirect(
        "/user/login?errorMessage=You must be logged in to view this page."
    );
    }
}

exports.UserDetail = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req)

    const selectedUser = await _userOps.getUserByUsername(req.params.id)
    const currentUser = await _userOps.getUserById(reqInfo.id)
    const usersList = await _userOps.getAllUsers()

    if(selectedUser) {
        res.render("../views/secure/secure-user-detail.ejs", {
            selectedUser: selectedUser.obj,
            currentUser: currentUser,
            usersList: usersList,
            reqInfo: reqInfo,
            layout: "./layouts/sidebar"
        })
    } else {
        res.render("../views/secure/secure-users.ejs", {
            users: usersList,
            currentUser: currentUser,
            reqInfo: RequestService.reqHelper(req),
            search: "",
            message: "Cannot find user"
        })
    }
}

// handle edit get request
exports.Edit = async function (req, res) {
    console.log("inside edit get", req.params.id)
    const userId = req.params.id
    let userObj = await _userOps.getUserById(userId)

    res.render("../views/secure/secure-edit-form.ejs", {
        reqInfo: RequestService.reqHelper(req),
        errorMessage: "",
        userId: userId,
        user: userObj
    })
}

// handle edit post request
exports.EditUser = async function (req, res) {

    console.log(req.body)
    let reqInfo = RequestService.reqHelper(req);
    const userId = req.params.id
    const userFirstName = req.body.firstName
    const userLastName = req.body.lastName
    const userInterests = req.body.interests
    const userPicturePath = req.body.profilePicturePath
    let picturePath = req.body.picture || ""

    if(req.files != null) {
        const { picture } = req.files;
        picturePath = `/images/${picture.name}`
        const serverPath = path.join(__dirname, "../public", picturePath);
        picture.mv(serverPath);
    } else {
        picturePath = userPicturePath
    }

    let userResponseObj = await _userOps.updateUserById(userId, userFirstName, userLastName, userInterests, picturePath)

    if (userResponseObj.errorMessage === "") {
        const currentUser = await _userOps.getUserById(reqInfo.id)
        console.log(`New User ${userResponseObj.obj}`)
        res.redirect(`/secure/${currentUser.id}`)
    } else {
        console.log("Edit unsuccessful")
        res.render("../views/secure/secure-edit-form.ejs", {
            reqInfo: RequestService.reqHelper(req),
            user: userResponseObj.obj,
            userId: userResponseObj.obj.userid,
            errorMessage: "Edit unsuccessful!"
        })
    }
}

exports.AddComment = async function (req, res) {

    const author = await _userOps.getUserById(req.body.currentUserId)
    const selectedUser = await _userOps.getUserById(req.params.id)

    const comment = {
        commentAuthor: author.username,
        commentBody: req.body.comment
    }
    let profileInfo = await _userOps.addCommentToUser(comment, selectedUser)

    if(profileInfo.errorMessage == ""){
        res.redirect(req.get("referer"))
    }
}

exports.DeleteComment = async function (req, res) {

    const userId = req.params.userId
    const commentId = req.params.commentId

    console.log(`userId: ${req.params.userId}\ncommentId: ${req.params.commentId}`)

    let results = await _userOps.deleteComment(commentId, userId)

    if(results == "") {
        res.redirect(req.get("referer"))
    }
}

exports.Delete = async function (req, res) {

    let reqInfo = RequestService.reqHelper(req)
    const userId = req.params.id
    console.log(`deleteing user with id ${userId}`)

    const currentUser = await _userOps.getUserById(reqInfo.id)
    let deletedUser = await _userOps.deleteUserById(userId)
    let users = await _userOps.getAllUsers()

    if(deletedUser) {
        res.render("../views/secure/secure-users.ejs", {
            reqInfo: reqInfo,
            currentUser: currentUser,
            users: users,
            search: "",
            message: "Delete Success!"
        })
    } else {
        res.render("../views/secure/secure-users.ejs", {
            reqInfo: reqInfo,
            currentUser: currentUser,
            users: users,
            search: "",
            message: "Delete Failed."
        })
    }
}