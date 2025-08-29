const express = require("express");
const multer = require("multer");
const upload = require("../../helper/storageMulter");
const router = express.Router();
const productsController = require("../../controller/admin/products.controller");
const productValidate = require("../../validates/admin/productValidate");
router.get("/", productsController.index);
router.get("/restore", productsController.restoreProducts);
router.patch("/change-status/:status/:id", productsController.changeStatus);
router.patch("/change-multil", productsController.changeMultil);
router.delete("/delete/:id", productsController.deleteProduct);
router.patch("/restore/:id", productsController.restoreProduct);
router.get("/create-product", productsController.createProduct);
router.get("/edit-product/:id", productsController.editProduct);
router.get("/detail/:id", productsController.detailProduct);
router.post(
  "/create-product",
  upload.single("thumbnail"),
  productValidate.createProductPost,
  productsController.createProductPost
);
router.post(
  "/edit-product/:id",
  upload.single("thumbnail"),
  productValidate.editProductPost,
  productsController.editProductPost
);
module.exports = router;
