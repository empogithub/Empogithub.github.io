const http = require("http");
const express = require("express");

const app = express();
app.use(express.static("./../", { index: "index.html" }));
http.createServer(app).listen(80);