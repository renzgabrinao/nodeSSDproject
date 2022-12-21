const User = require("../models/User");
const passport = require("passport");
const RequestService = require("../services/RequestService");
const path = require("path")
const UserOps = require("../data/userOps");
const { request } = require("express");

// Displays registration form.
exports.Register = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    res.render("user/register", { errorMessage: "", user: {}, reqInfo: reqInfo });
};

// Handles 'POST' with registration form submission.
exports.RegisterUser = async function (req, res) {
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    if (password == passwordConfirm) {

        let picturePath = req.body.picture || ""

        if (req.files != null) {
            const { picture } = req.files;
            picturePath = `/images/${picture.name}`
            const serverPath = path.join(__dirname, "../public", picturePath);
            picture.mv(serverPath);
        } else {
            picturePath = "/images/default-profile.jpg"
        }
    
        // Creates user object with mongoose model.
        // Note that the password is not present.
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
            role: req.body.role,
            interests: req.body.interests.split(","),
            picturePath: picturePath
        });
        // Uses passport to register the user.
        // Pass in user object without password
        // and password as next parameter.
        User.register(
            new User(newUser),
            req.body.password,
            function (err, account) {
            // Show registration form with errors if fail.
            if (err) {
                let reqInfo = RequestService.reqHelper(req);
                return res.render("user/register", {
                user: newUser,
                errorMessage: err,
                reqInfo: reqInfo,
                });
            }
            // User registered so authenticate and redirect to secure
            // area.
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secure/secure-area");
            });
            }
        );
    } else {
        let reqInfo = RequestService.reqHelper(req);
        res.render("user/register", {
            user: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
            role: req.body.role
            },
            errorMessage: "Passwords do not match.",
            reqInfo: reqInfo,
        });
    }
};

// Shows login form.
exports.Login = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage;
    res.render("user/login", {
        user: {},
        errorMessage: errorMessage,
        reqInfo: reqInfo,
    });
    };
    
// Receives login information & redirects
// depending on pass or fail.
exports.LoginUser = (req, res, next) => {
passport.authenticate("local", {
    successRedirect: "/secure/secure-area",
    failureRedirect: "/user/login?errorMessage=Invalid login.",
})(req, res, next);
};



// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
    // Use Passports logout function
    req.logout((err) => {
        if (err) {
        console.log("logout error");
        return next(err);
        } else {
        // logged out.  Update the reqInfo and redirect to the login page
        let reqInfo = RequestService.reqHelper(req);
        res.render("user/login", {
            user: {},
            isLoggedIn: false,
            errorMessage: "",
            reqInfo: reqInfo,
        });
        }
    });
};
  
  

  

