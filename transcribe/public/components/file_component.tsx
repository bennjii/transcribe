import ProjectContext from "@public/@types/project_context";
import { useContext } from "react";
import { Bold, Book, File as FileIcon, FileText, Italic, Underline } from "react-feather";

import styles from '@styles/Home.module.css'

import { File, Project } from '@public/@types/project'

const FileComponent: React.FC<{ data: File }> = ({ data }) => {
    const { project, editor, editorCallback } = useContext(ProjectContext);

    return (
        <div 
        //@ts-expect-error
        className={`${(editor?.id == data.id || editor?.active_sub_file == data.id) ? styles.openFile : styles.subFile}`} 
        onClick={() => {
            //@ts-expect-error
            if(editor.active_sub_file == data.id || editor.id == data.id) return;

            let book_parent;

            const reccursion = (element, state: Project, editorCallback: Function) => {
                return element?.children?.forEach(_element => {
                    if(_element.id == data.id) { 
                        if(element.type == 'book') {
                            book_parent = element;

                            editorCallback({ ...book_parent, active_sub_file: data.id });
                        }else {
                            editorCallback({ ...data });
                        }

                        return true;
                    }else return reccursion(_element, state, editorCallback);
                });
            }

            reccursion(project.file_structure, project, editorCallback);

            if(book_parent) {
                console.log("DOUBLY", book_parent);
                editorCallback({ ...book_parent, active_sub_file: data.id });
            }else {
                console.log("SINGLY", book_parent);
                editorCallback(data);
            }
        }} draggable>
            <FileIcon 
            size={18} 
            //@ts-expect-error
            color={editor?.id == data.id || editor?.active_sub_file == data.id ? "var(--acent-text-color)" : "var(--text-color)"}/>

            <p>{data.name}</p>
        </div>
    )
}

export default FileComponent;