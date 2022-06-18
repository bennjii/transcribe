import BookContext from "@public/@types/book_context";
import { File } from "@public/@types/project";
import ProjectContext from "@public/@types/project_context";
import { useContext, useEffect } from "react";
import { TextareaHTMLAttributes, useRef, useState } from "react";
import styles from '../../styles/Home.module.css'
import BookInput from "./book_input";
import BookInputQuill from "./book_input_quill";

const BookChapter: React.FC<{ chapter: number, content: File, domWidth: string, id: string }> = ({ id, chapter, content, domWidth }) => {
    const { editors, editorsCallback } = useContext(ProjectContext);
    const { viewOnly } = useContext(BookContext);

    const [ editingTitle, setEditingTitle ] = useState(false);
    const input_field = useRef(null);

    const [ bookState, setBookState ] = useState<File>(null);

    useEffect(() => {
        const ed = editors.findIndex(e => e.id == id);
        setBookState(editors[ed] as File);
    }, [editors]);

    useEffect(() => {
        input_field.current.value = content.name;
    }, [content])

    console.log(viewOnly);

    return (
        <div className={styles.page} style={{ minWidth: domWidth }} >
            <input 
                readOnly={viewOnly}
                className={`${bookState?.settings?.theme == "light" ? "" : "text-textColorDark"}`}
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