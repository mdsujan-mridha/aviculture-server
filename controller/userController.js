const catchAsyncErrors = require("../middleware/catchAsynError");
const User = require("../model/userModel");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/ErrorHandler");

exports.register = catchAsyncErrors(async (req, res, next) => {


    // get name,email and password from client 
    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "sample id",
            url: "sample url",
        }
    });
    sendToken(user, 201, res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    // get user email and password from client 
    const { email, password } = req.body;

    // now check this email and password is valid or not 
    if (!email || !password) {
        return next(new ErrorHandler("Please enter valid email and password", 400));
    }
    // now find user on database using email 
    const user = await User.findOne({ email }).select("+password");
    // if user not exist on database then i send message 
    if (!user) {
        return next(new ErrorHandler("user not found with is email", 401));
    }
    // now match password,user given password with stored password 
    const isPasswordMatched = await user.comparePassword(password);
    // if password are not same then rend message 
    if (!isPasswordMatched) {
        return next(new ErrorHandler("invalid email or password", 401));
    }
    // if everything is okay 
    sendToken(user, 200, res);

});

exports.logout = catchAsyncErrors(async (req, res, next) => {

    // remove token from browser cookie 
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "You are logged out",
    });

});
