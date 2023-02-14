const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { productValidation } = require("../validation/product-validation");

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  isAuth,
  productValidation,
  adminController.postAddProduct
);
router.post(
  "/edit-product",
  isAuth,
  productValidation,
  adminController.postEditProduct
);
router.delete("/product/:productId", isAuth, adminController.deleteProduct);

module.exports = router;
