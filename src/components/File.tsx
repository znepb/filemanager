import FileImage from '../components/FileImage.tsx'
import styles from "../styles/File.module.css"
import Link from 'next/link'


export default function File(props) {
  console.log(props);
  
  const date = new Date(props.created);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const sizes = [
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

  function checkSize(size) {
    for(let i in sizes) {
      let o = sizes[i];
      let divide = 1;
      if(i > 0) {
        divide = sizes[i - 1].size;
      }
      console.log(size, o.size);

      if(size < o.size) {
        console.log(Math.floor(size / divide).toString() + o.label);
        return Math.floor(size / divide).toString() + o.label;
      }
    }
  }

  console.log(props.path);

  return <tr key={props.name}>
    <td>
      <Link href={props.folder ? props.relpath : "api/" + props.path}>
        <a>{props.name}</a>
      </Link>
    </td>
    <td>
      {props.ext}
    </td>
    <td>
      {date.toDateString()} {date.toLocaleTimeString()}
    </td>
    <td>
      {props.folder ? "" : checkSize(props.size)}
    </td>
  </tr>
}