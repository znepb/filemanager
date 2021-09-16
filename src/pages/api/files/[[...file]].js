import * as fs from 'fs';
const path = require("path");
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  console.log(req.query);
  const { file } = req.query;
  let relfilePath = file.join("/");
  const filePath = path.join(__dirname, "/../../../../../files/", relfilePath)

  if(fs.existsSync(filePath)) {
    var readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } else {
    res.status(404);
    res.end();
  }
}
