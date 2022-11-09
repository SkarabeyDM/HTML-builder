const { readdir } = require("fs/promises")
const { createReadStream, createWriteStream } = require("fs")
const path = require("path")

const stylesDir = path.resolve(__dirname, "./styles")
const targetFile = path.resolve(__dirname, "./project-dist/bundle.css")

mergeFiles(stylesDir, targetFile);

async function mergeFiles(fromDir, toFile) {
   const writeStream = createWriteStream(toFile)

   const isCss = (str) => str.split(".").pop() === "css"
   const stylePath = (str) => path.join(fromDir, str)
   const merge = async (fileName) => createReadStream(stylePath(fileName)).pipe(writeStream)

   await Promise.all((await readdir(fromDir)).filter(isCss).map(merge))
}

