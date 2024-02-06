

const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { createProduct, getAllProducts, getProductDetails, updateProduct, deleteProduct, getAdminProduct } = require("../controller/productController");

const router = express.Router();


// create new product by admin 
router.route("/product/new").post(isAuthenticatedUser, createProduct);
// get all product 
router.route("/products").get(getAllProducts);
// get a single product 
router.route("/product/:id").get(getProductDetails);
// update product by admin 
router.route("/product/:id")
    .put(isAuthenticatedUser, updateProduct)
    .delete(isAuthenticatedUser, deleteProduct);

// get all product by admin 
router.route("/admin/product").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProduct)

module.exports = router;