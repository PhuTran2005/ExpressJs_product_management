const express = require("express");
const methodOverride = require("method-override"); // For PUT and DELETE methods
const bodyParser = require("body-parser"); // For parsing request bodies
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
//Flash
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret-key", // 🔑 để trong .env
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // bảo mật, cookie chỉ đọc qua http
      secure: false, // đổi thành true nếu chạy HTTPS
      maxAge: 1000 * 60 * 60, // 1 giờ
    },
  })
);

app.use(flash());

// Middleware: biến flash thành biến cục bộ (toàn bộ view đều dùng được)
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  next();
});

//End Flash

//Method override
app.use(methodOverride("_method")); // Override with different header for PUT and DELETE methods
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
//End Method override
require("dotenv").config(); // Load environment variables from .env file
const mongoose = require("mongoose"); // MongoDB connection
const systemConfig = require("./config/system"); // System configuration
//app local variables
app.locals.prefixAdmin = systemConfig.prefix_admin;
// Connect to the database
const Database = require("./config/database");
const port = process.env.PORT;
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
Database.conect();

// 📌 Middleware: Lấy URL hiện tại để xử lý active menu
app.use((req, res, next) => {
  res.locals.currentUrl = req.originalUrl;
  next();
});
const clientRoute = require("./routes/client/index.route");
const adminRoute = require("./routes/admin/index.route");
//routes
clientRoute(app);
adminRoute(app);
//End routes

//Pulic data
app.use(express.static(`${__dirname}/public`));
//End Pulic data

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
