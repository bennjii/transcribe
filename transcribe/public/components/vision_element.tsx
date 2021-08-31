import styles from '../../styles/Home.module.css'
import _ from 'underscore'
import { CanvasItem, Folder } from '@public/@types/project';
import { useContext, useState } from 'react';
import FileComponent from './file_component';
import FolderComponent from './folder_component';
import ProjectContext from '@public/@types/project_context';

const VisionElement: React.FC<{ data: CanvasItem }> = ({ data }) => {
    const { project, projectCallback, editor, editorCallback } = useContext(ProjectContext);
    const [ visionElement, setVisionElements ] = useState(data);

    return (
        <div 
            className={styles.visionBoard}
            key={`VISIONBOARD-${editor.id}`}
        >
            {
                data.type == "text" ?
                <div>
                    {
                        JSON.stringify(data.data)
                    }
                </div>
                :
                //@ts-expect-error
                <img src={data.data}></img>
            }
        </div>
    )
}

export default VisionElement;