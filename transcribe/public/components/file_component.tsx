import ProjectContext from "@public/@types/project_context";
import { useContext } from "react";
import { Bold, Book, Clipboard, Delete, File as FileIcon, FileText, Italic, MoreHorizontal, MoreVertical, Underline, X } from "react-feather";

import styles from '@styles/Home.module.css'

import { File, Folder, Project } from '@public/@types/project'
import { Button, Popover, useModal } from "@geist-ui/react";
import PrefrenceModal from "./prefrence_modal";

const FileComponent: React.FC<{ data: File, parent: Folder }> = ({ data, parent }) => {
    const { project, editor, editorCallback } = useContext(ProjectContext);
    const { visible, setVisible, bindings } = useModal();

    return (
        <div 
        key={`FILECOMPONENT-${data.id}-`}
        //@ts-expect-error
        className={`${(editor?.id == data.id || editor?.active_sub_file == data.id) ? styles.openFile : styles.subFile}`} 
        onClick={() => {
            //@ts-expect-error
            if(editor?.active_sub_file == data.id || editor?.id == data.id) return;

            let book_parent;

            const reccursion = (element, state: Project, editorCallback: Function) => {
                return element?.children?.forEach(_element => {
                    if(_element.id == data.id) { 
                        if(element.type == 'book' && !element?.settings?.performance) {
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

            if(book_parent && !book_parent?.settings?.performance) {
                project.active_file = book_parent.id;
                editorCallback({ ...book_parent, active_sub_file: data.id });
            }else {
                project.active_file = data.id;
                editorCallback(data);
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
                                        //@ts-expect-error
                                        color={editor?.id == data.id || editor?.active_sub_file == data.id ? "var(--acent-text-color)" : "var(--text-color)"}
                                        />
                                )
                            case "vision_board":
                                return (
                                    <Clipboard 
                                        size={18} 
                                        //@ts-expect-error
                                        color={editor?.id == data.id || editor?.active_sub_file == data.id ? "var(--acent-text-color)" : "var(--text-color)"}
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
                //@ts-expect-error
                (parent?.type == "book" && editor?.id == data.id || editor?.active_sub_file == data.id) ?
                <Popover style={{ backgroundColor: "transparent", display: "flex" }} placement={"right"} content={<div><Button type={"error"}  onClick={() => {
                    //@ts-expect-error
                    const new_children = editor?.children.filter(e => {
                        return e.id !== data.id
                    });

                    editorCallback({
                        ...editor,
                        children: new_children
                    });
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