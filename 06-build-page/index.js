const fsPromises = require("fs/promises")
const fs = require("fs")
const path = require("path")
const { Transform } = require("stream");

//const copyDir = require("../04-copy-directory/index.js");

const targetDir = path.join(__dirname, "/project-dist")

const buildPath = (subPath) => path.join(targetDir, subPath)
const sourcePath = (subPath) => path.resolve(__dirname, subPath)

// Файлы и папки билда
const style = buildPath("/style.css")
const markup = buildPath("/index.html")
const assets = buildPath("/assets")

// Ресурсы
const srcStylesDir = sourcePath("./styles");
const srcAssetsDir = sourcePath("./assets");
const srcHTML = sourcePath("template.html")
const srcHTMLComponents = sourcePath("./components")

console.log(srcHTML)

   // Главная функция. Точку с запятой не удалять
   ; (async () => {
      await fsPromises.mkdir(targetDir, { recursive: true });
      buildHTML(srcHTML, srcHTMLComponents, markup)
      copyDir(srcAssetsDir, assets)
      mergeFiles(srcStylesDir, style);
   })()

async function copyDir(srcDir, dupDir) {
   await fsPromises.rm(dupDir, { force: true, recursive: true });
   await fsPromises.mkdir(dupDir, { recursive: true });

   const files = await fsPromises.readdir(srcDir, { withFileTypes: true });

   for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const src = path.resolve(srcDir, file.name)
      const dup = path.resolve(dupDir, file.name)

      if (file.isFile())
         await fsPromises.copyFile(src, dup)
      else if (file.isDirectory())
         await copyDir(src, dup)
   }
}

async function mergeFiles(fromDir, toFile) {
   const writeStream = fs.createWriteStream(toFile)

   const isCss = (str) => str.split(".").pop() === "css"
   const stylePath = (str) => path.join(fromDir, str)
   const merge = async (fileName) => fs.createReadStream(stylePath(fileName)).pipe(writeStream)

   await Promise.all((await fsPromises.readdir(fromDir)).filter(isCss).map(merge))
}

async function buildHTML(srcFile, componentsDir, buildFile) {
   const components = new Map(await Promise.all
      ((await fsPromises.readdir(componentsDir))
         .map(async file => [file.replace(".html", ""), await fsPromises.readFile(path.join(srcHTMLComponents, file), "utf8")]))
   )

   const readStream = fs.createReadStream(srcFile).pipe(new HTMLComponentStream(components)).pipe(fs.createWriteStream(buildFile))
   //console.log(components)
}

class HTMLComponentStream extends Transform {
   constructor(components) {
      super();
      this._components = components
   }

   _transform(chunk, encoding, callback) {
      const comp = chunk.toString().replace(/{{(\w+)}}/g, (target) => this._components.get(/\w+/.exec(target)[0]))
      this.push(Buffer.from(comp, "utf8"))
      callback()
   }
}