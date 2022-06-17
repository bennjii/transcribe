import ProjectContext from "@public/@types/project_context";
import { useContext } from "react";
import { Bold, Book as BookIcon, Italic, Underline, Folder as FolderIcon, BookOpen, Plus, MoreHorizontal, ChevronRight, ChevronDown } from "react-feather";

import styles from '@styles/Home.module.css'

import { File, Folder } from '@public/@types/project'
import { useModal } from "@geist-ui/react";
import NewFileModal from "./new_file_modal";
import PrefrenceModal from "./preference_modal";
import FolderPrefrenceModal from "./folder_prefrences";

const FolderComponent: React.FC<{ data: Folder, callback: Function, value: boolean }> = ({ data, callback, value }) => {
    const { project, projectCallback, editor, editorCallback } = useContext(ProjectContext);

    const { visible, setVisible, bindings } = useModal();
    const { visible: prefrencesVisible, setVisible: setPrefrencesVisible, bindings: prefrenceBindings } = useModal();
    
    return (
        <div 
        key={`FOLDERCOMPONENT-${data.id}-`}
        className={`${editor?.id == data.id ? styles.openFolderHeader : styles.folderHeader} ${(data.type == "folder") ? styles.folderDefault : ""}`} 
        onClick={(e) => {
            if(data.type == 'book') { 
                projectCallback({ ...project, active_file: data.id });
                editorCallback({ ...data, active_sub_file: data.children[0].id });
            }

            // editorCallback(data);
        }} draggable>
            <div onClick={() => {
                callback(!value);
            }}>
                {
                    data.type == 'book' ?
                    editor?.id == data.id ? <BookOpen size={18} color={editor?.id == data.id ? "var(--acent-text-color)" : "var(--text-inactive)"} /> : <BookIcon size={18} color={editor?.id == data.id ? "var(--acent-text-color)" : "var(--text-inactive)"} />
                    :
                    !value ? 
                        <ChevronRight id="folderIcon" size={18} color={editor?.id == data.id ? "var(--acent-text-color)" : "var(--text-inactive)"}/>
                        :
                        <ChevronDown id="folderIcon" size={18} color={editor?.id == data.id ? "var(--acent-text-color)" : "var(--text-inactive)"}/>
                }
                
                <p>{data.name}</p>
            </div>
            
            {
                data.type == "folder" ? 
                <div className={styles.folderNewItem}>
                    <MoreHorizontal size={16} strokeWidth={2} color={"var(--text-muted)"} onClick={() => setPrefrencesVisible(true)}/>
                    <Plus size={16} strokeWidth={2} color={"var(--text-muted)"} onClick={() => setVisible(true)}/>

                    <NewFileModal modal={{ visible, setVisible, bindings }} location={data}/>
                    <FolderPrefrenceModal modal={{ prefrencesVisible, setPrefrencesVisible, prefrenceBindings }} data={data}/>
                </div>
                :
                <></>
            }
            
        </div>
    )
}

export default FolderComponent;