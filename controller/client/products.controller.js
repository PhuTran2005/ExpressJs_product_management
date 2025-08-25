const products = require("../../model/products.model");
const searchFunction = require("../../helper/search");
const createPagination = require("../../helper/pagination");
const constances = require("../../const/index");
const systemConfig = require("../../config/system"); // System configuration

// [GET] /products
module.exports.index = async (req, res) => {
  // Lấy các tham số truy vấn từ URL
  const { page, ...restQuery } = req.query;
  // Xoá param "page" khỏi query để giữ các filter khác
  const queryString = Object.entries(restQuery)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  // Initialize the query object
  let findQuery = {
    status: "active",
    deleted: false, // Assuming you want to filter out deleted products
  };
  // // filterStatus function
  // const filterStatusResult = fillterStatus(req.query.status);
  // if (req.query.status) {
  //   findQuery.status = req.query.status; // Default to 'active' if no status is provided
  // }
  // Search functionality
  console.log(req.query.keyword);
  const searchResult = searchFunction(req.query.keyword);
  if (searchResult.searchKeyword) {
    findQuery.title = searchResult.serchRegex; // Use the regex for case-insensitive search
  }

  // Pagination functionality
  const pagination = createPagination(
    parseInt(req.query.page) || 1,
    await products.countDocuments(findQuery),
    constances.items_per_page_client // Default to 4 items per page if not specified
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
  res.render("client/pages/Products/index", {
    pageTitle: "Danh sách sản phẩm",
    data: data,
    // fillterStatus: filterStatusResult,
    searchKeyword: searchResult.searchKeyword,
    pagination: pagination,
    queryString: queryString, //giữ các tham số truy vấn khác
  });
};
// [GET] /products/:slug
module.exports.detailProduct = async (req, res) => {
  const slug = req.params.slug;
  const find = {
    deleted: false,
    slug: slug,
    status: "active",
  };
  try {
    const product = await products.findOne(find);
    console.log(product);
    // Render the admin products page with the fetched data
    res.render("client/pages/Products/detailProduct.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    req.flash("error_msg", "❌ Có lỗi xảy ra!");
    res.redirect(req.get("referer")); // Tự động quay về trang trước — tương đương "back"
  }
};
