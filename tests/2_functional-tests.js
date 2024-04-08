const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let likes = null;

suite("Functional Tests", function () {
	test("Viewing one stock: GET request to /api/stock-prices/", (done) => {
		chai
			.request(server)
			.get("/api/stock-prices/")
			.query({ stock: "GOOG", like: "false" })
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.equal(res.body.stockData.stock, "GOOG");
				done();
			});
	});
	test("Viewing one stock and liking it: GET request to /api/stock-prices/", (done) => {
		chai
			.request(server)
			.get("/api/stock-prices/")
			.query({ stock: "GOOG", like: "true" })
			.end((err, res) => {
				likes = res.body.stockData.likes;
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.equal(res.body.stockData.stock, "GOOG");
				done();
			});
	});
	test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", (done) => {
		chai
			.request(server)
			.get("/api/stock-prices/")
			.query({ stock: "GOOG", like: "true" })
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.equal(res.body.stockData.stock, "GOOG");
				assert.equal(res.body.stockData.likes, likes);
				done();
			});
	});
	test("Viewing two stocks: GET request to /api/stock-prices/", (done) => {
		chai
			.request(server)
			.get("/api/stock-prices/")
			.query({ stock: ["GOOG", "MSFT"], like: "false" })
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.isArray(res.body.stockData);
                assert.equal(res.body.stockData[0].stock, "GOOG")
                assert.equal(res.body.stockData[1].stock, "MSFT")
                assert.property(res.body.stockData[0], 'rel_likes')
                assert.property(res.body.stockData[1], 'rel_likes')
				done();
			});
	});
    test("Viewing two stocks and liking them: GET request to /api/stock-prices/", (done) => {
		chai
			.request(server)
			.get("/api/stock-prices/")
			.query({ stock: ["GOOG", "MSFT"], like: "true" })
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.isArray(res.body.stockData);
                assert.equal(res.body.stockData[0].stock, "GOOG")
                assert.equal(res.body.stockData[1].stock, "MSFT")
                assert.property(res.body.stockData[0], 'rel_likes')
                assert.property(res.body.stockData[1], 'rel_likes')
				done();
			});
	});
});
