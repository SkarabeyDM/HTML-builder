const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "text.txt");

fs.createReadStream(file, "utf8").on("data", console.log);