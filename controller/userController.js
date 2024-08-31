const catchAsyncErrors = require("../middleware/catchAsynError");
const User = require("../model/userModel");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/ErrorHandler");
const sendEmail = require("../utils/sendMail");
const cloudinary = require("cloudinary");


exports.register = catchAsyncErrors(async (req, res, next) => {

  const mycloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avater",
    width: 150,
    crop: "scale",
  });
  // get name,email and password from client 
  const { name, email, password } = req.body;
  const user = await User.create({
    name, email, password,
    avatar: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
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
// get logged user details 

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("Can't load user with this id", 401))
  }
  res.status(200).json({
    success: true,
    user
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //  deploy korar time ai ta use kora lagbe tai akhon comment kore dilm
  // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

  // demo url 
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `E-commerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});



// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});



// update user password 

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));

  }
  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);

})
// update user profile

// exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findById(req.user.id).select("+password");

//   const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

//   if (!isPasswordMatched) {
//     return next(new ErrorHandler("Old password is incorrect", 400));
//   }
//   if (req.body.newPassword !== req.body.confirmPassword) {
//     return next(new ErrorHandler("password does not match", 400));

//   }

//   user.password = req.body.newPassword;
//   await user.save();

//   sendToken(user, 200, res);

// })
// update user profile

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  //  add cloudinary 
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avater",
      width: 150,
      crop: "scale",
    });
    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true,
    user,
  })
});



// get all user by admin

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  })
})

//  get single user by admin 

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`user does not exist id :${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    user,
  })
});

// update user role 
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});



// DELETE USER

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  // there user params bcz this request will send by admin bt is this request will send bt user then i write (req.user.id)
  if (!user) {
    {
      return next(new ErrorHandler(`User does not exist with id : ${req.params.id}`, 400));
    }
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "user deleted Successfully",
  })
})

