import BookContext from "@public/@types/book_context";
import { File } from "@public/@types/project";
import ProjectContext from "@public/@types/project_context";
import { useContext, useEffect } from "react";
import { TextareaHTMLAttributes, useRef, useState } from "react";
import styles from '../../styles/Home.module.css'
import BookInput from "./book_input";
import BookInputQuill from "./book_input_quill";

const BookChapter: React.FC<{ chapter: number, content: File, domWidth: string }> = ({ chapter, content, domWidth }) => {
    const { editor, editorCallback } = useContext(ProjectContext);
    const { viewOnly } = useContext(BookContext);

    const [ editingTitle, setEditingTitle ] = useState(false);
    const input_field = useRef(null);

    useEffect(() => {
        input_field.current.value = content.name;
    }, [content])

    console.log(viewOnly);

    return (
        <div className={styles.page} style={{ minWidth: domWidth }} >
            <input 
                readOnly={viewOnly}
                className={`${editor?.settings?.theme == "light" ? "" : "text-textColorDark"}`}
                type="text"
                ref={input_field}
                autoFocus={!viewOnly}
                defaultValue={content?.name}
                onChange={(e) => {
                    content.name = input_field.current?.value;
                }}
                onKeyPress={(e) => {
                    if(e.key == "Enter") {
                        setEditingTitle(!editingTitle);
                    }
                }}
            />

            <BookInputQuill value={content} chapter={chapter} />
        </div>
    )
}

export default BookChapter;