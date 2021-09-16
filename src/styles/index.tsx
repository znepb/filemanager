import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import File from '../components/File.tsx'
import * as fs from 'fs';

export default function Home({files}) {
  return <>
    <table className={styles.mainTable}>
      <tr><th>File Name</th><th>Type</th><th>Created</th><th>Size</th></tr>
      {files.map((file) => (
         <File name={file.name} ext={file.ext} created={file.created} size={file.size} path={file.path}></File>
      ))}
    </table>
  </>
}

export async function getStaticProps(context) {
  const outfiles = [];

  let dir = "./files/";
  let files = fs.readdirSync(dir);

  for(let i in files) {
    let file = files[i];
    let extension = file.split('.').pop();
    let stats = fs.statSync(dir + file);
    console.log(stats.size);

    outfiles.push({
      name: file,
      ext: extension,
      created: stats.birthtime.toISOString(),
      size: stats.size,
      path: dir + file
    })
  }

  return {
    props: {
      files: outfiles
    }, // will be passed to the page component as props
  }
}