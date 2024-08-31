
const express = require("express");
const { createPost, getAllPost, getPostDetails, getAdminPost, updatePost, deletePost } = require("../controller/postController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// create post by admin
router.route("/admin/post/new").post(isAuthenticatedUser,createPost);

// get all post 
router.route("/posts").get(getAllPost);
// get post details 
router.route("/post/:id").get(getPostDetails);
// get all post by admin 
router.route("/admin/posts").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminPost)
// update and delete post by admin 
router.route("/admin/post/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updatePost)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deletePost);
    
module.exports = router;