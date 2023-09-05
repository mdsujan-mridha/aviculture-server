
const express = require("express");
const {
    register,
    loginUser,
    logout,
    getUserDetails
} = require("../controller/userController");

const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

// register user
router.route("/register").post(register);
// login user 
router.route("/login").post(loginUser);
// logout user 
router.route("/logout").get(logout);
// get logger user 
router.route("/me").get(isAuthenticatedUser, getUserDetails);
module.exports = router;