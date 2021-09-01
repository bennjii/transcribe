import styles from '../../styles/Home.module.css'
import _ from 'underscore'
import { CanvasItem, Folder } from '@public/@types/project';
import { useCallback, useContext, useRef, useState } from 'react';
import FileComponent from './file_component';
import FolderComponent from './folder_component';
import ProjectContext from '@public/@types/project_context';
import Draggable from 'react-draggable';
import BookContext from '@public/@types/book_context';
import 'react-quill/dist/quill.bubble.css';

const VisionElement: React.FC<{ data: CanvasItem }> = ({ data }) => {
    const { project, projectCallback, editor, editorCallback } = useContext(ProjectContext);
    const [ visionElement, setVisionElements ] = useState(data);
    const { book, callback, viewOnly } = useContext(BookContext);

    // Title
    const input_field = useRef(null);
    // Editor
    const input_ref = useRef(null);
    // Drag
    const drag_ref = useRef(null);

    const verif = useCallback(
		_.debounce((state) => {
			projectCallback({
                ...project,
                file_structure: { ...project.file_structure }
            })
		}, 1500)
		, []
	);

    const ReactQuill = require('react-quill');
    const { Quill } = require('react-quill');

    const handleChange = (raw_content) => {
        console.log(``)
    }

    const updateDrag = (update) => {
        const { x, y } = (drag_ref.current?.state);
        data.position.x = x;
        data.position.y = y;

        verif()
    }

    return (
        <Draggable 
            bounds="parent"
            cancel="span"
            defaultPosition={{ x: data?.position?.x ?? 0, y: data?.position?.y ?? 0 }}
            onDrag={updateDrag}
            ref={drag_ref}
            >
            <div 
                className={styles.visionBoard}
                key={`VISIONBOARD-${editor.id}`}
            >
                <div className={`${styles.dragBar} .handle`}></div>
                <div className={styles.visionTitle}>
                    <input 
                        className="no-cursor"
                        type="text"
                        ref={input_field}
                        defaultValue={data.name}
                        onChange={(e) => {
                            data.name = input_field.current?.value;
                        }}
                    />
                </div>

                {
                    data.type == "text" ?
                    <div className={`${styles.inputAreaVision} no-cursor`}>
                        <ReactQuill 
                            readOnly={viewOnly}
                            ref={input_ref}
                            theme={"bubble"}
                            defaultValue={data?.data} 
                            placeholder={"Start Typing Here..."}
                            onChange={handleChange}
                            /> 
                    </div>
                    :
                    //@ts-expect-error
                    <img src={data.data}></img>
                }
            </div>
        </Draggable>
    )
}

export default VisionElement;