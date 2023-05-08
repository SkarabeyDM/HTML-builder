const { readdir } = require("fs/promises")
const { createReadStream, createWriteStream } = require("fs")
const path = require("path")

const stylesDir = path.resolve(__dirname, "./styles")
const targetFile = path.resolve(__dirname, "./project-dist/bundle.css")

mergeFiles(stylesDir, targetFile);

async function mergeFiles(fromDir, toFile) {
   const writeStream = createWriteStream(toFile)

   const isCss = (str) => /.css$/.test(str)
   const merge = async (fileName) => {
      if (isCss(fileName))
         createReadStream(path.join(fromDir, fileName)).pipe(writeStream)
   }

   await (await readdir(fromDir)).forEach(await merge)
}

