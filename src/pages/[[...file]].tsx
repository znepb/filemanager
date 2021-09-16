import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import File from '../components/File.tsx'
import Link from 'next/link'

import * as fs from 'fs';
const patha = require("path");

export default function Home({files, folders, baseDir}) {
  if(files === undefined) {
    return <p>Loading...</p>;
  }
  return <>
    <h3>znepb's File Manager</h3>
    <strong>
      <Link href="../"><a>../</a></Link>
      
      <span style={{
        paddingRight: "1rem"
      }}></span>

      <span>/</span>
      <span>
        {baseDir.join("/")}
      </span>
    </strong>
    <table className={styles.mainTable}>
      <tr><th>File Name</th><th>Type</th><th>Created</th><th>Size</th></tr>
      {folders.map((folder) => (
         <File name={folder.name} ext={folder.ext} created={folder.created} size={folder.size} path={folder.path} folder={folder.folder} relpath={folder.relPath}></File>
      ))}

      {files.map((file) => (
         <File name={file.name} ext={file.ext} created={file.created} size={file.size} path={file.path} folder={file.folder}></File>
      ))}
    </table>
  </>
}

export async function getStaticPaths() {
  let paths = [];

  return {
    paths: [
      ""
    ],
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const outfiles = [];
  const outfolders = [];

  const base = context.params.file || [];
  console.log("BaseNExt");
  console.log(base);

  let basePath = "";
  if(base) {
    basePath = base.join("/");
  }

  let dir = patha.join("./files/", basePath);
  console.log("lsdir", dir);
  let files = fs.readdirSync(dir);

  for(let i in files) {
    let file = files[i];
    let extension = file.split('.').pop();
    console.log(patha.join(dir, file));
    let stats = fs.statSync(patha.join(dir, file));
    console.log(stats.size);

    if(stats.isDirectory()) {
      outfolders.push({
        name: file,
        ext: "Folder",
        created: stats.birthtime.toISOString(),
        size: stats.size,
        path: patha.join(dir, file),
        folder: stats.isDirectory(),
        relPath: basePath + "/" + file
      })
    } else {
      outfiles.push({
        name: file,
        ext: extension,
        created: stats.birthtime.toISOString(),
        size: stats.size,
        path: patha.join(dir, file),
        folder: stats.isDirectory()
      })
    }
  }
 
  console.log("NextUndefined");
  console.log(base);
  return {
    props: {
      files: outfiles,
      folders: outfolders,
      baseDir: base || []
    }, // will be passed to the page component as props
  }
}