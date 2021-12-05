import type { NextApiRequest, NextApiResponse } from 'next'

import * as fs from 'fs';
import * as path from 'path';

export default function listdir(req: NextApiRequest, res: NextApiResponse) {
  const dirName = req.query.dirName;

  if(typeof dirName == "object" || typeof dirName == "undefined") {

    const dir: string = dirName ? dirName.join("/") : "/";
    const folderpath: string = path.join("./", "public", dir);

    let readme: string | undefined;
    
    if(fs.existsSync(folderpath)) {

      if(fs.existsSync(path.join(folderpath, "README.md"))) {
        readme = fs.readFileSync(path.join(folderpath, "README.md"), "ascii");
      }

      const list = fs.readdirSync(folderpath);
      const returnFiles = [];

      list.forEach(file => {
        const stats = fs.statSync(path.join(__dirname, "../../../../../", folderpath, file));

        if(stats.isDirectory()) {
          returnFiles.push({
            name: file,
            created: stats.birthtime,
            isDirectory: stats.isDirectory(),
          });
        } else {
          returnFiles.push({
            name: file,
            created: stats.birthtime,
            size: stats.size,
            isDirectory: false
          })
        }
      })

      res.status(200).json({
        files: returnFiles,
        readme: readme
      })
    } else {
      res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "The requested folder does not exist."
        }
      })
    }
  }
}