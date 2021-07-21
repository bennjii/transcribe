import ProjectContext from "@public/@types/project_context";
import { useContext } from "react";
import { Bold, Book, Italic, Underline } from "react-feather";

import styles from '@styles/Home.module.css'

import { File, Project } from '@public/@types/project'

const FileComponent: React.FC<{ data: File }> = ({ data }) => {
    const { project, projectCallback, editor, editorCallback } = useContext(ProjectContext);

    return (
        <div className={`${(project.active_file == data.id || editor?.active_sub_file == data.id) ? styles.openFile : styles.subFile}`} onClick={() => {
            projectCallback({ ...project, active_file: data.id })

            const reccursion = (element, state: Project, editorCallback: Function) => {
                return element?.children?.forEach(_element => {
                    if(_element.id == data.id) { 
                        projectCallback({ ...project, active_file: element.id });
                        editorCallback({ ...editor, active_sub_file: data.id });
                        return true;
                    }
            
                    if(_element.id == state.active_file) return;
                    else return reccursion(_element, state, editorCallback);
                });
            }

            // projectCallback({ ...project, active_file: data.id });
            // editorCallback(data);

            reccursion(project.file_structure, project, editorCallback);
        }} draggable>
            <Book size={18} color={project.active_file == data.id ? "var(--acent-text-color)" : "var(--text-color)"}/>

            <p>{data.name}</p>
        </div>
    )
}

export default FileComponent;