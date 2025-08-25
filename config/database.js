const mongoose = require("mongoose");
module.exports.conect = async () => {
  try {
    mongoose.connect(process.env.DB_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};
