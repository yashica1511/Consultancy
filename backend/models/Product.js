const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  hsnCode: String,
  rate: Number,
  gstRate: Number,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
