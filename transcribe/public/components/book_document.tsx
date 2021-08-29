import { File } from "@public/@types/project";
import ProjectContext from "@public/@types/project_context";

import { useContext } from "react";
import { useRef, useState } from "react";

import styles from '../../styles/Home.module.css'
import Editor from "./editor";

const BookDocument: React.FC<{ content: File }> = ({ content }) => {
    const { editor, editorCallback } = useContext(ProjectContext);
    const [ editingTitle, setEditingTitle ] = useState(false);
    const input_field = useRef(null);

    return (
        <div className={styles.page}> 
            <input 
                type="text"
                ref={input_field}
                defaultValue={content?.name}
                onChange={(e) => {
                    console.log(e);

                    content.name = input_field.current?.value;
                    console.log(input_field.current?.value)
                }}
                onKeyPress={(e) => {
                    if(e.key == "Enter") {
                        setEditingTitle(!editingTitle);
                    }
                }}
            />

            <Editor 
            //@ts-expect-error
            content={editor} 
            />
        </div>
    )
}

export default BookDocument;