import ProjectContext from "@public/@types/project_context";
import { memo, useContext } from "react";
import { Bold, Italic, Underline } from "react-feather";
import RawToolbar from "./raw_toolbar";

import 'react-quill/dist/quill.snow.css';
import styles from '@styles/Home.module.css'

const CustomToolbar: React.FC<{  }> = ({ }) => {
    const { editor, editorCallback } = useContext(ProjectContext);

    if(!editor) 
        return (
            <></>
        )

    if(editor.type == "vision_board") 
        return (
            <div className={styles.visionMock}>
                VisionBoard
            </div>
        )

    if(!editor.is_folder)
        return (
            <div key={`TOOLBAR-${editor?.id}`}>
                <RawToolbar id={'single'} />
            </div>   
        )

    return (
        <div>
            { 
                editor?.children.map(e => {
                    return (
                        <>
                            <div 
                                key={`TOOLBAR-${e.id}`}
                                
                            >    
                                <RawToolbar id={e.id} />
                            </div>
                        </>
                    )
                })
            }
        </div>
    )
}

export default CustomToolbar;