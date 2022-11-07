const fsPromises = require("fs/promises")
const path = require("path")

const sourceDir = path.resolve(__dirname, "./files");
const duplicateDir = path.resolve(__dirname, "./files-copy");

copyDir(sourceDir, duplicateDir)

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