const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater"); //Slug update item
mongoose.plugin(slug);
const productSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    deleted: { type: Boolean, default: false },
    stock: Number,
    position: Number,
    status: String,
    description: String,
    discountPercentage: Number,
    thumbnail: String,
    deletedAt: Date,
    position: Number,
    slug: { type: String, slug: ["title", "subtitle"], unique: true },
  },
  { timestamps: true }
);
const Product = mongoose.model("products", productSchema);
module.exports = Product;
