// [GET] /admin/dashboard
module.exports.index = (req, res) => {
  res.render("admin/pages/Dashboard/index", {
    pageTitle: "Tổng quan",
  });
};
