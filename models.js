const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
	stock: { type: String, required: true },
	likes: [],
});

const Stock = mongoose.model("Stock", StockSchema);

exports.Stock = Stock;

