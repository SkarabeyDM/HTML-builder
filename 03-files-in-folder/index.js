const promises = require("fs/promises");
const path = require("path");

const dir = path.join(__dirname, "secret-folder");

const pathToFile = (fileName) => path.join(dir, fileName);
// Разделяет имя файла и расширение
const fileExt = (fileName) => fileName.match(/^(.+)\.([0-9a-z]+)$/).slice(1)
// Записывает данные о файле в строку
const fileStats = async (fileName) => [...fileExt(fileName), (await promises.stat(pathToFile(fileName))).size / 1000 + "kb"].join(" - ");

// Вызов анонимной функции запускающей анонимную асинхронную функцию
(async () => {
   const files = await promises.readdir(dir, { withFileTypes: true });

   files.forEach(async file => {
      if (file.isFile()) {
         const stats = await fileStats(file.name)
         console.log(stats)
      }
   })
})()


// Старый вариант, до рефактора:

//const parseFileName = (fileName) => fileName.split(".");

// (async () => {
//    let files = await promises.readdir(dir, { withFileTypes: true });
//    files = await Promise.all(files
//       // Удаление папок
//       .filter(file => file.isFile())
//       // Читаемый вид
//       .map(async ({ name: fileName }) => [...parseFileName(fileName), (await promises.stat(pathToFile(fileName))).size / 1000 + "kb"].join(" - ")))

//    // Вывод в консоль
//    files.forEach(file => console.log(file))
// })()