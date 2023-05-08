const fs = require("fs");
const path = require("path");
const { stdin, stdout } = process

const file = path.join(__dirname, "text.txt");

// Launch
fs.writeFile(file, "", (err) => {
   if (err) throw err;
   console.log("Введите строку:")
})

// Events
process.on("exit", () => stdout.write("Удачи!"));
process.on("SIGINT", process.exit);

// User input
stdin.on("data", data => {
   const key = data.toString().toLowerCase().trim();
   if (key === "exit")
      process.exit()
   else
      fs.appendFile(file, data, (err) => { if (err) throw err; })
})