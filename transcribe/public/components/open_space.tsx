import BookContext from "@public/@types/book_context";
import { File, Folder } from "@public/@types/project";
import ProjectContext from "@public/@types/project_context";

import { useContext, useEffect } from "react";
import { useRef, useState } from "react";
import { ChevronLeft, Minus, X } from "react-feather";
import BookDocument from "./book_document";

const DropZone: React.FC = () => {
    const { project, editor, editorCallback } = useContext(ProjectContext);

    const maker_ref = useRef<HTMLDivElement>(null);
    const [ content, setContent ] = useState(null);
    const [ draggingOver, setDraggingOver ] = useState(false);

    const rec = (target: string, source: Folder, callback: Function) => {
        source.children.forEach(e => {
            if(e.id == target) callback(e);
            else if(e.is_folder) rec(target, e, callback);
        })
    }

    useEffect(() => {
        console.log(maker_ref);
        if(maker_ref) {
            maker_ref.current.addEventListener('drop', (e) => {
                setDraggingOver(false);
                const data = e.dataTransfer.getData("identifier");
                console.log(data, e);

                rec(data, project.file_structure, (file) => {
                    setContent(file);
                })
            })

            maker_ref.current.addEventListener('dragover', (e) => {
                e.preventDefault();
            })

            maker_ref.current.addEventListener('dragover', (e) => {
                e.preventDefault();
                setDraggingOver(true);
            })
        }
    }, [])

    return content ? (
            <div className={`flex flex-col h-full bg-accentTextColorDark bg-opacity-10 rounded-md w-[400px] overflow-y-auto overflow-x-hidden ${draggingOver ? "bg-accentTextColorDark bg-opacity-20" : ""}`} ref={maker_ref}>
                {
                    draggingOver ? 
                        <div className="flex flex-col items-center justify-center h-full" style={{ fontFamily: "Sans" }}>
                            <p>Drop Here</p>
                        </div>
                        :
                        <></>
                }

                {
                    !draggingOver && content ? 
                    <>
                        <div className="p-1">
                            <X size={20} color="rgb(87 140 245)" onClick={() => setContent(null)} />
                        </div>
                        <BookDocument key={`AppendedBookDocument`} content={content} domWidth="400px" />
                    </>   
                    :
                    <>
                        <div style={{ width: '400px' }}></div>
                    </>
                }
            </div>               
    ) : 
        <div className={`flex flex-col h-full w-2 ${draggingOver ? "bg-accentTextColorDark bg-opacity-20" : ""}`} ref={maker_ref}>
            {
                draggingOver ? 
                    <div className="flex flex-col items-center justify-center h-full " style={{ fontFamily: "Sans" }}>
                    </div>
                    :
                    <></>
            }
        </div>               
}

export default DropZone;