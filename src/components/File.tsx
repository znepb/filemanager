import Link from "next/link";

import {useRouter} from "next/router";
import path from "path";
import {useEffect, useState} from 'react';

interface Size {
  size: number,
  label: string
}

interface FileProps { 
  created: string,
  name: string,
  folder: boolean,
  ext?: string,
  size: number
}

export default function File( { created, name, folder, ext, size }: FileProps ) {
  const [sizeStr, setSize] = useState("");

  const router = useRouter();

  const date = new Date(created);
  const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const sizes: Size[] = [
    {
      size: 1024,
      label: " B"
    },
    {
      size: 1024 * 1024,
      label: " KB"
    },
    {
      size: 1024 * 1024 * 1024,
      label: " MB"
    },
    {
      size: 1024 * 1024 * 1024 * 1024,
      label: " TB"
    }
  ]

  const m = 100;

  function checkSize() {
    let sizeSet = false;
    sizes.forEach((o: Size, i: number) => {
      if(size < o.size && !sizeSet) {
        sizeSet = true;
        setSize(`${Math.floor(o.size / size)} ${o.label}`);
        return;
      }
    })
  }

  useEffect(checkSize, []);

  return <tr key={name}>
    <td>
      {folder ? (
        <strong>
          <Link href={router.query.file && typeof router.query.file === "object" ? "/" + path.join(router.query.file.join("/"), name) : name}>{name}</Link>
        </strong>
      ) : (
        <a target="_blank" href={router.query.file && typeof router.query.file === "object" ? "/" + path.join(router.query.file.join("/"), name) : name}>{name}</a>
      )}
    </td>
    <td>
      {ext && ext}
    </td>
    <td>
      {date.toLocaleDateString()} {date.toLocaleTimeString()}
    </td>
    <td>
      {!folder && sizeStr}
    </td>
  </tr>
}