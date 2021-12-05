import styles from '../styles/Home.module.css'
import File from '../components/File'
import MarkdownView from 'react-showdown';

import Head from "next/head";
import Link from "next/link";

import title from "../../config";

import {useRouter} from 'next/router';
import {useEffect, useState} from "react";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [baseDir, setBaseDir] = useState([]);
  const [md, setMd] = useState();

  const [dirUp, setDirUp] = useState("/");

  const router = useRouter();

  function load() {
    if(router.isReady) {
      if(typeof router.query.file == "object" || typeof router.query.file == "undefined") {
        setBaseDir(router.query.file);

        let baseDirClone = router.query.file ? [...router.query.file] : [];
        baseDirClone.pop();
        setDirUp("/" + baseDirClone.join("/"));

        let path = router.query.file ? router.query.file.join("/") : "";

        setLoaded(false);
        fetch(`/api/list/${path}`).then(resp => resp.json().then((json) => {
          if(!json.error) {
            const content = json.files;
            const tempFolders = [];
            const tempFiles = [];

            content.forEach((o) => {
              if(o.isDirectory) {
                tempFolders.push(o);
              } else {
                const tempFile = {
                  ext: o.name.match(/\.[0-9a-z]+$/i),
                  ...o,
                }

                tempFiles.push(tempFile);
              }
            })

            setMd(json.readme);
            setFolders(tempFolders);
            setFiles(tempFiles);

            setLoaded(true);
          }
        }))
      }
    }
  }

  useEffect(load, [router])

  return loaded ? (
    <main>
      <Head>
        <title>/{baseDir && baseDir.join("/")} - {title.title}</title>
      </Head>
      
      <h3>{title.title}</h3>
      <strong>
        <Link href={dirUp}>../</Link>
        
        <span style={{
          paddingRight: "1rem"
        }}></span>

        <span>/</span>
        <span>
          {baseDir && baseDir.join("/")}
        </span>
      </strong>

      <br />

      <div>
        <MarkdownView markdown={md} options={{tables: true, emoji: true}}/>
      </div>

      <table className={styles.mainTable}>
        <thead>
          <tr><th>File Name</th><th>Type</th><th>Created</th><th>Size</th></tr>
        </thead>
        <tbody>
          {folders.map((folder) => (
            <File 
              name={folder.name} 
              ext="Folder"
              created={folder.created} 
              size={folder.size} 
              folder={true}
            />  
          ))}

          {files.map((file) => (
            <File 
              name={file.name} 
              ext={file.ext}
              created={file.created} 
              size={file.size} 
              folder={false}
            />  
          ))}
        </tbody>
      </table>
  </main> ) : ( <main>
    <Head>
      <title>{title.title}</title>
    </Head>
      
    <h3>{title.title}</h3>
    <strong>
      <Link href={dirUp}>../</Link>
      
      <span style={{
        paddingRight: "1rem"
      }}></span>
      
      <span>/</span>
      <span>
        {baseDir && baseDir.join("/")}
      </span>
    </strong>

    <p>Loading...</p>
  </main> )
}