import styles from '../../styles/Home.module.css'
import _ from 'underscore'
import { Folder } from '@public/@types/project';
import { useContext, useState } from 'react';
import FileComponent from './file_component';
import FolderComponent from './folder_component';
import ProjectContext from '@public/@types/project_context';
import VisionElement from './vision_element';

const VisionCanvas: React.FC<{ }> = ({ }) => {
    const { project, projectCallback, editor, editorCallback } = useContext(ProjectContext);

    return (
        <div 
            className={styles.visionBoardCanvas}
            key={`VISIONBOARD-${editor.id}`}
        >
            {
                // @ts-expect-error
                editor?.data?.map(element => {
                    return (
                        <VisionElement data={element} key={`VISIONELEMENT-${element.id}`}/>
                    )
                })
            }
        </div>
    )
}

export default VisionCanvas;