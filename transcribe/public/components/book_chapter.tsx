import { TextareaHTMLAttributes, useRef, useState } from "react";
import styles from '../../styles/Home.module.css'
import BookInput from "./book_input";
import BookInputQuill from "./book_input_quill";

const BookChapter: React.FC<{ chapter: number, content: any }> = ({ chapter, content }) => {
    const input_field = useRef(null);
    const [ chapterValue, setChapterValue ] = useState(content);

    return (
        <div className={styles.page}>
            <h2 
            contentEditable
            style={{
                ...content.format
            }}>{content.title}</h2>

            {/* <BookInputQuill value={chapterValue} chapter={chapter} /> Alternate Title Implentation? */} 

            <BookInputQuill value={chapterValue} chapter={chapter} />
        </div>
    )
}

export default BookChapter;