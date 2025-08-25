// [GET] /
module.exports.index = (req, res) => {
  res.render("client/pages/Home/index", {
    pageTitle: "Trang chủ",
  });
};
