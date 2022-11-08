const { readdir } = require("fs/promises")
const { createReadStream, createWriteStream } = require("fs")
const path = require("path")

const stylesDir = path.resolve(__dirname, "./styles")
const targetFile = path.resolve(__dirname, "./project-dist/bundle.css")

mergeFiles();

async function mergeFiles() {
   const writeStream = createWriteStream(targetFile)

   const isCss = (str) => str.split(".").pop() === "css"
   const stylePath = (str) => path.join(stylesDir, str)
   const merge = async (fileName) => createReadStream(stylePath(fileName)).pipe(writeStream)

   await Promise.all((await readdir(stylesDir)).filter(isCss).map(merge))
}

