import ProjectContext from "@public/@types/project_context";
import { useContext, useEffect, useState } from "react";
import { Bold, Book as BookIcon, Italic, Underline, Folder as FolderIcon, BookOpen, Plus, MoreHorizontal, ChevronRight, ChevronDown } from "react-feather";

import styles from '@styles/Home.module.css'

import { File, Folder } from '@public/@types/project'
import { useModal } from "@geist-ui/react";
import NewFileModal from "./new_file_modal";
import PrefrenceModal from "./preference_modal";
import FolderPrefrenceModal from "./folder_prefrences";

const FolderComponent: React.FC<{ data: Folder, callback: Function, value: boolean }> = ({ data, callback, value }) => {
    const { project, projectCallback, editors, editorsCallback } = useContext(ProjectContext);

    const { visible, setVisible, bindings } = useModal();
    const { visible: prefrencesVisible, setVisible: setPrefrencesVisible, bindings: prefrenceBindings } = useModal();

    const [ bookState, setBookState ] = useState<Folder>(null);

    useEffect(() => {
        const ed = editors.findIndex(e => e?.id == data.id);
        setBookState(editors[ed] as Folder);
    }, [editors]);

    return (
        <div 
        key={`FOLDERCOMPONENT-${data.id}-`}
        className={`${bookState ? styles.openFolderHeader : styles.folderHeader} ${(data.type == "folder") ? styles.folderDefault : ""}`} 
        onClick={(e) => {
            if(data.type == 'book') { 
                projectCallback({ ...project, active_file: data.id });

                let new_editors = editors.map((e: File | Folder) => {
                    if(e.id == data.id) {
                        e = { ...data, active_sub_file: data.children[0].id };
                    }
                });

                editorsCallback(new_editors);
            }

            // editorCallback(data);
        }} draggable>
            <div onClick={() => {
                callback(!value);
            }}>
                {
                    data.type == 'book' ?
                    bookState ? <BookOpen size={18} color={bookState ? "var(--acent-text-color)" : "var(--text-inactive)"} /> : <BookIcon size={18} color={bookState ? "var(--acent-text-color)" : "var(--text-inactive)"} />
                    :
                    !value ? 
                        <ChevronRight id="folderIcon" size={18} color={bookState ? "var(--acent-text-color)" : "var(--text-inactive)"}/>
                        :
                        <ChevronDown id="folderIcon" size={18} color={bookState ? "var(--acent-text-color)" : "var(--text-inactive)"}/>
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