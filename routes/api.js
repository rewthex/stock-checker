"use strict";

const axios = require("axios");
const url =
	"https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/[symbol]/quote";

const mongoose = require("mongoose");
const StockModel = require("../models").Stock;

const anonymize = (ip) => {
	const octets = ip.split(".");
	octets[3] = "0";
	return octets.join(".");
};

const fetchStock = async (stock, ip, like) => {
	const apiUrl = url.replace("[symbol]", stock);
	const response = await axios.get(apiUrl);
	const price = response.data.latestPrice;

	let existingStock = await StockModel.findOne({ stock });
	if (!existingStock) {
		const newStock = new StockModel({ stock });
		existingStock = await newStock.save();
	}
	if (like && !existingStock.likes.includes(ip)) {
		console.log(ip);
		existingStock.likes.push(ip);
		await existingStock.save();
	}
	const likes = existingStock.likes.length;

	const stockData = { stock, price, likes };

	return stockData;
};

module.exports = function (app) {
	app
		.route("/api/stock-prices")

		.get(async (req, res) => {
			const stock = req.query.stock;
			const like = req.query.like === "true";
			const ip = anonymize(req.ip);

			if (Array.isArray(stock)) {
				const stockOne = await fetchStock(stock[0], ip, like);
				const stockTwo = await fetchStock(stock[1], ip, like);
				const stockOneLikes = stockOne.likes;
				const stockTwoLikes = stockTwo.likes;
				return res.json({
					stockData: [
						{
							stock: stockOne.stock,
							price: stockOne.price,
							rel_likes: stockOneLikes - stockTwoLikes,
						},
						{
							stock: stockTwo.stock,
							price: stockTwo.price,
							rel_likes: stockTwoLikes - stockOneLikes,
						},
					],
				});
			} else {
				const stockOne = await fetchStock(stock, ip, like);

				return res.json({
					stockData: {
						...stockOne,
					},
				});
			}
		});
};
