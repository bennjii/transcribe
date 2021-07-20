import ProjectContext from "@public/@types/project_context";
import { useContext } from "react";
import { Bold, Book, Italic, Underline } from "react-feather";

import styles from '@styles/Home.module.css'

import { File } from '@public/@types/project'

const FileComponent: React.FC<{ data: File }> = ({ data }) => {
    const { project, callback } = useContext(ProjectContext);

    return (
        <div className={`${project.active_file == data.id ? styles.openFile : styles.subFile}`} onClick={() => {
            callback({ ...project, active_file: data.id });
        }} draggable>
            <Book size={18} color={"var(--text-color)"}/>

            <p>{data.name}</p>
        </div>
    )
}

export default FileComponent;