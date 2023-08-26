
const express = require("express");
const { register, loginUser, logout } = require("../controller/userController");


const router = express.Router();

// register user
router.route("/register").post(register);
// login user 
router.route("/login").post(loginUser);
// logout user 
router.route("/logout").get(logout);

module.exports = router;