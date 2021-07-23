import ProjectContext from "@public/@types/project_context";
import { memo, useContext } from "react";
import { Bold, Italic, Underline } from "react-feather";
import RawToolbar from "./raw_toolbar";

const CustomToolbar: React.FC<{  }> = ({ }) => {
    const { project, projectCallback, editor, editorCallback } = useContext(ProjectContext);

    if(!editor || !editor.is_folder)
        return (
            <RawToolbar id={'single'} />
        )

    const MemoisedToolbar = memo(props => (
        <div>
            { 
                editor?.children.map(e => {
                    return (
                        <div key={`TOOLBAR-${e.id}`}>
                            <RawToolbar id={e.id} />
                        </div>
                    )
                })
            }
        </div>
    ));

    return <MemoisedToolbar /> 
}

export default CustomToolbar;