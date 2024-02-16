const catchAsyncErrors = require("../middleware/catchAsynError");

const Product = require("../model/productModel");
const ErrorHandler = require("../utils/ErrorHandler");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");
// create new product 
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }
    const imageLink = [];
    for (let i = 0; i < images?.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });
        imageLink.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    req.body.images = imageLink;
    req.body.user = req.user?.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    })

});

// get all product 
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 20;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter();

    let products = await apiFeature.query;
    let filteredProduct = products.length;
    apiFeature.pagination(resultPerPage);

    products = await apiFeature.query.clone();

    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        filteredProduct,
    })

});

// get single product 
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found with this ID", 404))
    }
    res.status(200).json({
        success: true,
        product,
    })

});
// update product 
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id,
        req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        product,
    })
});

// delete product 
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: "Product Deleted",
    });
});

// get all product by admin 
exports.getAdminProduct = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    })
})


// my products 

exports.myProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find({ user: req.user._id });
    // const products = await Product.find().populate('user', '_id').exec();

    if (products.length === 0) {
        return next(new ErrorHandler("You have not posted any products", 404));
    }

    res.status(200).json({
        success: true,
        products,
    });
});
