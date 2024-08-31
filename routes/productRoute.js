

const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { createProduct, getAllProducts, getProductDetails, updateProduct, deleteProduct, getAdminProduct, myProducts, createProductReview, deleteReview, getProductReviews } = require("../controller/productController");

const router = express.Router();


// create new product by admin 
router.route("/product/new").post(isAuthenticatedUser, createProduct);
// get all product 
router.route("/products").get(getAllProducts);
// get a single product 
router.route("/product/:id").get(getProductDetails);
// router.route("/product/me").get(isAuthenticatedUser,myProducts);
router.route("/products/me").get(myProducts);
// get logged user product 
// router.route("/product/me").get(isAuthenticatedUser, myProducts);
// get admin product 

// update product by admin 
router.route("/admin/product/:id")
    .put(isAuthenticatedUser, updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// get all product by admin 
router.route("/admin/products").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProduct);


// product review 

router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview);

module.exports = router;