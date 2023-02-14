const Product = require("../models/product");
const { validationResult } = require("express-validator");
const { get500 } = require("../controllers/error");
const fileHelper = require("../util/file");
const constants = require("../util/constants");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessages: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const description = req.body.description;
  const price = +req.body.price;
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessages: [{ msg: "Attached file is not an image" }],
    });
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessages: errors.array(),
    });
  }
  const image_url = image.path;
  const product = new Product({
    title,
    price,
    description,
    image_url,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (product) {
        res.render("admin/edit-product", {
          product: product,
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: editMode,
          hasError: false,
          errorMessages: [],
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDescription = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescription,
        _id: productId,
      },
      errorMessages: errors.array(),
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      if (image) {
        fileHelper.deleteFile(product.image_url);
        product.image_url = image.path;
      }
      return product.save().then((result) => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found."));
      }
      fileHelper.deleteFile(product.image_url);
      return Product.deleteOne({ _id: productId, userId: req.user._id });
    })
    .then((result) => {
      res.status(200).json({
        message: "Success!",
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Deleting product failed!" });
    });
};

exports.getProducts = (req, res, next) => {
  // Product.find({ userId: req.user._id })
  //   // .select('title price -_id')
  //   // .populate('userId','name')
  //   .then((products) => {
  //     res.render("admin/products", {
  //       prods: products,
  //       pageTitle: "All Products",
  //       path: "/admin/products ",
  //     });
  //   })
  const page = +req.query.page || 1;
  let totalItems;
  Product.find({ userId: req.user._id })
    .countDocuments()
    .then((numberOfProducts) => {
      totalItems = numberOfProducts;
      return Product.find({ userId: req.user._id })
        .skip((page - 1) * constants.ITEMS_PER_PAGE)
        .limit(constants.ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Products",
        path: "/admin/products",
        currentPage: page,
        totalProducts: totalItems,
        hasNextPage: constants.ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / constants.ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
