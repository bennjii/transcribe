import { File } from "@public/@types/project";
import ProjectContext from "@public/@types/project_context";
import { useContext } from "react";
import { TextareaHTMLAttributes, useRef, useState } from "react";
import styles from '../../styles/Home.module.css'
import BookInput from "./book_input";
import BookInputQuill from "./book_input_quill";

const BookChapter: React.FC<{ chapter: number, content: File }> = ({ chapter, content }) => {
    const input_field = useRef(null);
    const [ chapterValue, setChapterValue ] = useState(content);

    const { editor, editorCallback } = useContext(ProjectContext);

    return (
        <div className={styles.page}>
            <h2 
            style={
                content?.title_format
            }>{content?.name}</h2>

            {/* <BookInputQuill value={chapterValue} chapter={chapter} /> Alternate Title Implentation? */} 

            <BookInputQuill value={content} chapter={chapter} />
        </div>
    )
}

export default BookChapter;