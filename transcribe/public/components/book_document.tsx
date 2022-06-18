import BookContext from "@public/@types/book_context";
import { File, Folder } from "@public/@types/project";
import ProjectContext from "@public/@types/project_context";

import { useContext, useEffect } from "react";
import { useRef, useState } from "react";

import styles from '../../styles/Home.module.css'
import Editor from "./editor";

const BookDocument: React.FC<{ content: File, domWidth: string, id: string }> = ({ content, domWidth, id }) => {
    const { editors, editorsCallback } = useContext(ProjectContext);
    const [ editingTitle, setEditingTitle ] = useState(false);
    const [ bookTitle, setBookTitle ] = useState(content?.name);
    const { viewOnly } = useContext(BookContext);

    const input_field = useRef(null);

    const [ bookState, setBookState ] = useState<File>(null);

    useEffect(() => {
        const ed = editors.findIndex(e => e.id == id);
        setBookState(editors[ed] as File);
    }, [editors]);

    useEffect(() => {
        setBookTitle(content?.name);

        input_field.current.value = content?.name;
    }, [content?.name])

    return (
        <div className={styles.page} key={bookState?.id} style={{ minWidth: domWidth }}> 
            <input 
                readOnly={viewOnly}
                className={`${bookState?.settings?.theme == "light" ? "" : "text-textColorDark"}`}
                type="text"
                ref={input_field}
                defaultValue={bookTitle}
                onChange={(e) => {
                    content.name = input_field.current?.value;
                }}
                onKeyPress={(e) => {
                    if(e.key == "Enter") {
                        setEditingTitle(!editingTitle);
                    }
                }}
            />

            <Editor 
                //@ts-expect-error
                content={bookState} 
                />
        </div>
    )
}

export default BookDocument;