import ProjectContext from "@public/@types/project_context";
import { useContext } from "react";
import { Bold, Italic, Underline } from "react-feather";
import RawToolbar from "./raw_toolbar";

const CustomToolbar: React.FC<{  }> = ({ }) => {
    const { project, projectCallback, editor, editorCallback } = useContext(ProjectContext);

    if(editor) if(editor.is_folder) console.log(editor.children);

    if(!editor || !editor.is_folder)
        return (
            <RawToolbar id={'single'}/>
        )
    else 
        return (
            <div>
                {
                    editor.children.map(e => {
                        console.log(e);

                        return (
                            <div>
                                <RawToolbar id={e.id}/>
                            </div>
                        )
                    })
                }
            </div>
        )
    
}

export default CustomToolbar;