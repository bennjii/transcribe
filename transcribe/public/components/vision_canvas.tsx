import styles from '../../styles/Home.module.css'
import _ from 'underscore'
import { Folder } from '@public/@types/project';
import { useContext, useState } from 'react';
import FileComponent from './file_component';
import FolderComponent from './folder_component';
import ProjectContext from '@public/@types/project_context';

const VisionCanvas: React.FC<{ }> = ({ }) => {
    const { project, projectCallback, editor, editorCallback } = useContext(ProjectContext);
    const [ visionElement, setVisionElements ] = useState(false);

    return (
        <div 
            className={styles.visionBoard}
            key={`VISIONBOARD-${editor.id}`}
        >
            
        </div>
    )
}

export default VisionCanvas;