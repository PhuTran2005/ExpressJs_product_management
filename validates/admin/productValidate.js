module.exports.createProductPost = (req, res, next) => {
  if (!req.body.title || req.body.title === "") {
    req.flash("error_msg", "❌ vui lòng nhập tiêu đề!");
    res.redirect(req.get("referer")); // Tự động quay về trang trước — tương đương "back"
    return;
  }
  if (!req.file) {
    req.flash("error_msg", "❌ Vui lòng chọn ảnh!");
    res.redirect(req.get("referer")); // Tự động quay về trang trước — tương đương "back"
  }
  next();
};
module.exports.editProductPost = (req, res, next) => {
  if (!req.body.title || req.body.title === "") {
    req.flash("error_msg", "❌ vui lòng nhập tiêu đề!");
    res.redirect(req.get("referer")); // Tự động quay về trang trước — tương đương "back"
    return;
  }

  next();
};
