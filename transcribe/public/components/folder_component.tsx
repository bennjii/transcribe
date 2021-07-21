import ProjectContext from "@public/@types/project_context";
import { useContext } from "react";
import { Bold, Book, Italic, Underline, Folder as FolderIcon } from "react-feather";

import styles from '@styles/Home.module.css'

import { File, Folder } from '@public/@types/project'

const FolderComponent: React.FC<{ data: Folder }> = ({ data }) => {
    const { project, projectCallback, editor, editorCallback } = useContext(ProjectContext);

    return (
        <div className={`${project.active_file == data.id ? styles.openFolderHeader : styles.folderHeader}`} onClick={() => {
            if(data.type == 'book') projectCallback({ ...project, active_file: data.id });
            // editorCallback(data);
        }} draggable>
            <FolderIcon size={18} color={project.active_file == data.id ? "var(--acent-text-color)" : "var(--text-inactive)"}/>

            <p>{data.name}</p>
        </div>
    )
}

export default FolderComponent;