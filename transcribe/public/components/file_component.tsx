import ProjectContext from "@public/@types/project_context";
import { useContext, useEffect, useState } from "react";
import { Bold, Book, Clipboard, Delete, File as FileIcon, FileText, Italic, MoreHorizontal, MoreVertical, Underline, X } from "react-feather";

import styles from '@styles/Home.module.css'

import { File, Folder, Project } from '@public/@types/project'
import { Button, Popover, useModal } from "@geist-ui/react";
import PrefrenceModal from "./preference_modal";

const FileComponent: React.FC<{ data: File, parent: Folder }> = ({ data, parent }) => {
    const { project, editors, editorsCallback } = useContext(ProjectContext);
    const { visible, setVisible, bindings } = useModal();

    const [ bookState, setBookState ] = useState<File | Folder>(null);
    const [ active, setActive ] = useState(false);

    useEffect(() => {
        const ed = editors.findIndex(e => e?.id == data.id);
        setBookState(editors[ed]);

        editors.forEach(e => {
            console.log(e?.active_sub_file, data.id);
            if(e?.active_sub_file == data.id) {
                setActive(true)
            }
        });
    }, [editors]);

    return (
        <div 
        key={`FILECOMPONENT-${data.id}-`}
        className={`${(bookState || active) ? styles.openFile : styles.subFile}`} 
        onClick={() => {
            if(active || bookState) return;

            let book_parent;

            const reccursion = (element, state: Project, editorCallback: Function) => {
                return element?.children?.forEach(_element => {
                    if(_element.id == data.id) { 
                        if(element.type == 'book' && !element?.settings?.performance) {
                            book_parent = element;

                            book_parent.active_sub_file = data.id;

                            editors.forEach((e: File | Folder) => {
                                if(e.id == book_parent.id) {
                                    e = book_parent;
                                }
                            });

                            editorCallback({ ...editors });
                        }else {
                            editorCallback({ ...editors });
                        }

                        return true;
                    }else return reccursion(_element, state, editorCallback);
                });
            }

            reccursion(project.file_structure, project, editorsCallback);

            if(book_parent && !book_parent?.settings?.performance) {
                project.active_file = book_parent.id;

                book_parent.active_sub_file = data.id;

                editors.forEach((e: File | Folder) => {
                    if(e.id == book_parent.id) {
                        e = book_parent;
                    }
                });

                editorsCallback({ ...editors });
            }else {
                project.active_file = data.id;
                editorsCallback({ ...editors });
            }
        }} draggable>
            <div>
                {
                    (() => {
                        if(parent?.type == "book" && !parent?.settings?.performance) return <></>;
                        // else if(parent?.settings?.performance) return 

                        switch(data.type) {
                            case "document":
                                return (
                                    <FileText 
                                        size={18} 
                                        color={(bookState || active) ? "var(--acent-text-color)" : "var(--text-color)"}
                                        />
                                )
                            case "vision_board":
                                return (
                                    <Clipboard 
                                        size={18} 
                                        color={(bookState || active) ? "var(--acent-text-color)" : "var(--text-color)"}
                                        />
                                )
                            default: 
                                return (
                                    <></>
                                )
                        } 
                    })()
                }
                
                <p>{data.name == "" ? "Unnamed Chapter" : data.name}</p>
            </div>
            
            {
                (parent?.type == "book" && bookState || active) ?
                <Popover style={{ backgroundColor: "transparent", display: "flex" }} placement={"right"} content={<div><Button type={"error"}  onClick={() => {
                    if(bookState.is_folder) {
                        const new_children = bookState?.children.filter(e => {
                            return e.id !== data.id
                        });

                        const new_book_state = {
                            ...bookState,
                            children: new_children
                        }

                        const new_book = editors.map((e: File | Folder) => {
                            if(e.id == data.id) {
                                e = new_book_state;
                            }
                        });
    
                        editorsCallback(new_book);
                    }
                }}>Confirm Remove</Button></div>}>
                    <X color={"var(--acent-text-color)"} size={16} />
                </Popover>
                
                :
                <></>
            }
            
            <PrefrenceModal modal={{ visible, setVisible, bindings }} data={data}/>
        </div>
    )
}

export default FileComponent;