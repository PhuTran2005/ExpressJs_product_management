const products = require("../../model/products.model");
const fillterStatus = require("../../helper/filterStatus");
const searchFunction = require("../../helper/search");
const createPagination = require("../../helper/pagination");
const constances = require("../../const/index");
const systemConfig = require("../../config/system"); // System configuration

// [GET] /admin/products
module.exports.index = async (req, res) => {
  // Lấy các tham số truy vấn từ URL
  const { page, ...restQuery } = req.query;
  // Xoá param "page" khỏi query để giữ các filter khác
  const queryString = Object.entries(restQuery)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  // Initialize the query object
  let findQuery = {
    deleted: false, // Assuming you want to filter out deleted products
  };
  // filterStatus function
  const filterStatusResult = fillterStatus(req.query.status);
  if (req.query.status) {
    findQuery.status = req.query.status; // Default to 'active' if no status is provided
  }
  // Search functionality
  const searchResult = searchFunction(req.query.keyword);
  if (searchResult.searchKeyword) {
    findQuery.title = searchResult.serchRegex; // Use the regex for case-insensitive search
  }

  // Pagination functionality
  const pagination = createPagination(
    parseInt(req.query.page) || 1,
    await products.countDocuments(findQuery),
    constances.items_per_page_admin // Default to 4 items per page if not specified
  );
  // Fetch products from the database
  const data = await products
    .find(findQuery)
    .sort({ position: 1 })
    .skip(pagination.skipItems)
    .limit(pagination.itemsPerPage);
  data.forEach((item) => {
    item.salePrice = (
      item.price -
      (item.price * item.discountPercentage) / 100
    ).toFixed(2);
  });
  // Render the admin products page with the fetched data
  res.render("admin/pages/Products/index", {
    pageTitle: "Quản lý sản phẩm",
    data: data,
    fillterStatus: filterStatusResult,
    searchKeyword: searchResult.searchKeyword,
    pagination: pagination,
    queryString: queryString, //giữ các tham số truy vấn khác
  });
};
// [GET] /admin/products/restore
module.exports.restoreProducts = async (req, res) => {
  console.log("oceee");
  // Lấy các tham số truy vấn từ URL
  const { page, ...restQuery } = req.query;
  // Xoá param "page" khỏi query để giữ các filter khác
  const queryString = Object.entries(restQuery)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  // Initialize the query object
  let findQuery = {
    deleted: true, // Assuming you want to filter out deleted products
  };
  // filterStatus function
  const filterStatusResult = fillterStatus(req.query.status);
  if (req.query.status) {
    findQuery.status = req.query.status; // Default to 'active' if no status is provided
  }
  // Search functionality
  const searchResult = searchFunction(req.query.keyword);
  if (searchResult.searchKeyword) {
    findQuery.title = searchResult.serchRegex; // Use the regex for case-insensitive search
  }

  // Pagination functionality
  const pagination = createPagination(
    parseInt(req.query.page) || 1,
    await products.countDocuments(findQuery),
    constances.items_per_page // Default to 4 items per page if not specified
  );
  // Fetch products from the database
  const data = await products
    .find(findQuery)
    .skip(pagination.skipItems)
    .limit(pagination.itemsPerPage);
  data.forEach((item) => {
    item.salePrice = (
      item.price -
      (item.price * item.discountPercentage) / 100
    ).toFixed(2);
  });
  // Render the admin products page with the fetched data
  res.render("admin/pages/Products/restoreProducts", {
    pageTitle: "Khôi phục sản phẩm",
    data: data,
    fillterStatus: filterStatusResult,
    searchKeyword: searchResult.searchKeyword,
    pagination: pagination,
    queryString: queryString, //giữ các tham số truy vấn khác
  });
};
// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  console.log(id);
  // Validate the status
  if (!["active", "inactive"].includes(status)) {
    return res.status(400).send("Invalid status");
  }
  try {
    await products.updateOne({ _id: id }, { status: status });
    req.flash("success_msg", "✅ Thay đổi trạng thái sản phẩm thành công!");
    res.redirect(req.get("referer")); // Tự động quay về trang trước — tương đương "back"
  } catch (error) {
    req.flash(
      "error_msg",
      "❌ Có lỗi xảy ra khi thay đổi trạng thái sản phẩm!"
    );
    res.redirect(req.get("referer")); // Tự động quay về trang trước — tương đương "back"
  }
  // Update the product status in the database
  // Redirect back to the products page
};
// [PATCH] /admin/products/restore/:id
module.exports.restoreProduct = async (req, res) => {
  const id = req.params.id;
  // Validate the ID
  if (!id) {
    return res.status(400).send("Invalid product ID");
  }
  try {
    await products.updateOne(
      { _id: id },
      { deleted: false, restoredAt: new Date() }
    );
    req.flash("success_msg", "✅ Khôi phục sản phẩm thành công!");
    // Redirect back to the products page
    res.redirect(req.get("referer")); // Tự động quay về trang trước — tương đương "back"
  } catch (error) {
    req.flash("error_msg", "❌ Có lỗi xảy ra khi khôi phục sản phẩm!");
    res.redirect(req.get("referer")); // Tự động quay về trang trước — tương đương "back"
  }
  // Update the product to mark it as deleted
};
// [PATCH] /admin/products/change-multil
module.exports.changeMultil = async (req, res) => {
  const ids = req.body.ids ? req.body.ids.split(",") : [];

  // Validate the status
  const status = req.body.type;
  try {
    switch (status) {
      case "delete":
        // Update the status for each selected product
        await products.updateMany(
          { _id: { $in: ids } },
          { deleted: true, deletedAt: new Date() }
        );
        break;
      case "change-position":
        // Update the position for each selected product
        ids.forEach(async (item) => {
          const [_id, value] = item.split("-");
          console.log(_id, value);
          await products.updateOne({ _id: _id }, { position: value });
        });
        break;

      case "restore":
        // Update the status for each selected product
        await products.updateMany(
          { _id: { $in: ids } },
          { deleted: false, restoredAt: new Date() }
        );
        break;

      default:
        // Update the status for each selected product
        await products.updateMany({ _id: { $in: ids } }, { status: status });
        break;
    }
    req.flash("success_msg", "✅ Thay đổi thành công!");
    res.redirect(req.get("referer")); // Tự động quay về trang trước — tương đương "back"
  } catch (error) {
    req.flash("error_msg", "❌ Có lỗi xảy ra khi Thay đổi!");
    res.redirect(req.get("referer")); // Tự động quay về trang trước — tương đương "back"
  }

  // // Redirect back to the products page
};
// [DELETE] /admin/products/delete/:id
module.exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  // Validate the ID
  if (!id) {
    return res.status(400).send("Invalid product ID");
  }
  // Update the product to mark it as deleted
  try {
    await products.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() }
    );
    req.flash("success_msg", "✅ Xóa sản phẩm thành công!");
    // Redirect back to the products page
    res.redirect(req.get("referer")); // Tự động quay về trang trước — tương đương "back"
  } catch (error) {
    req.flash("error_msg", "❌ Có lỗi xảy ra khi xóa sản phẩm!");
    res.redirect(req.get("referer")); // Tự động quay về trang trước — tương đương "back"
  }
};
// [GET] /admin/products/add-product
module.exports.createProduct = async (req, res) => {
  // Render the admin products page with the fetched data
  res.render("admin/pages/Products/createProduct", {
    pageTitle: "Thêm sản phẩm",
  });
};

// [POST] /admin/products/add-product
module.exports.createProductPost = async (req, res) => {
  console.log(req.file);
  // Render the admin products page with the fetched data
  try {
    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);

    if (req.body.position === "") {
      const countProducts = await products.countDocuments();
      req.body.position = countProducts + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    if (req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    const newProduct = new products(req.body);
    await newProduct.save();

    req.flash("success_msg", "✅ Tạo sản phẩm thành công!");
    res.redirect(`${systemConfig.prefix_admin}/products`);
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "❌ Có lỗi xảy ra khi tạo sản phẩm!");
    res.redirect(`${systemConfig.prefix_admin}/products`);
  }
};
// [GET] /admin/products/edit-product/:id
module.exports.editProduct = async (req, res) => {
  const id = req.params.id;
  const product = await products.findById(id); // tìm theo id
  // Render the admin products page with the fetched data
  res.render("admin/pages/Products/editProduct", {
    pageTitle: `Chỉnh sửa sản phẩm ${product.title}`,
    product: product,
  });
};
// [POST] /admin/products/edit-product/:id
module.exports.editProductPost = async (req, res) => {
  const id = req.params.id;
  // Render the admin products page with the fetched data
  try {
    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);

    if (req.body.position === "") {
      const countProducts = await products.countDocuments();
      req.body.position = countProducts + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    if (req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    await products.updateOne({ _id: id }, req.body);
    req.flash("success_msg", "✅ Cập nhật sản phẩm thành công!");
    return res.redirect(req.get("referer")); // Tự động quay về trang trước — tương đương "back"
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "❌ Có lỗi xảy ra khi cập nhật sản phẩm!");
    res.redirect(req.get("referer")); // Tự động quay về trang trước — tương đương "back"
  }
};
// [GET] /admin/products/detail/:id
module.exports.detailProduct = async (req, res) => {
  const id = req.params.id;
  const product = await products.findById(id); // tìm theo id
  // Render the admin products page with the fetched data
  res.render("admin/pages/Products/detailProduct", {
    pageTitle: product.title,
    product: product,
  });
};
