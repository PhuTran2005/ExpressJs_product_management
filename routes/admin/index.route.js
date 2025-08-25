const dashboardRoutes = require("./dashboard.route");
const productsRoutes = require("./products.route");
const systemConfig = require("../../config/system");
module.exports = (app) => {
  const prefixAdmin = systemConfig.prefix_admin;

  app.use(prefixAdmin + "/dashboard", dashboardRoutes);
  app.use(prefixAdmin + "/products", productsRoutes);
};
