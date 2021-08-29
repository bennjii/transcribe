import ProjectContext from "@public/@types/project_context";
import { useContext } from "react";
import { Bold, Book as BookIcon, Italic, Underline, Folder as FolderIcon, BookOpen } from "react-feather";

import styles from '@styles/Home.module.css'

import { File, Folder } from '@public/@types/project'

const FolderComponent: React.FC<{ data: Folder }> = ({ data }) => {
    const { project, projectCallback, editor, editorCallback } = useContext(ProjectContext);

    return (
        <div className={`${editor?.id == data.id ? styles.openFolderHeader : styles.folderHeader}`} onClick={() => {
            if(data.type == 'book') { 
                console.log("Heres the book, we are setting to relative to the project", project);
                projectCallback({ ...project, active_file: data.id });
                editorCallback({ ...data, active_sub_file: data.children[0].id });
            }
            // editorCallback(data);
        }} draggable>
            {
                data.type == 'book' ?
                editor?.id == data.id ? <BookOpen size={18} color={editor?.id == data.id ? "var(--acent-text-color)" : "var(--text-inactive)"} /> : <BookIcon size={18} color={editor?.id == data.id ? "var(--acent-text-color)" : "var(--text-inactive)"} />
                :
                <FolderIcon size={18} color={editor?.id == data.id ? "var(--acent-text-color)" : "var(--text-inactive)"}/>
            }
            
            <p>{data.name}</p>
        </div>
    )
}

export default FolderComponent;