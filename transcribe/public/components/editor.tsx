import { useContext, useEffect, useRef, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import BookContext from "../@types/book_context";

import _ from 'underscore'
import ProjectContext from "@public/@types/project_context";
import { File } from "@public/@types/project";

import styles from '@styles/Home.module.css'

const Editor: React.FC<{ }> = ({ }) => {
    const { editor, editorCallback } = useContext(ProjectContext);

    const input_ref = useRef();

    const handleChange = (raw_content) => {
        // //@ts-expect-error
        // setChapterState(input_ref?.current?.getEditor()?.editor?.delta);

        // // if(!raw_content) return false;
        
        // //@ts-expect-error
        // setSavedState(input_ref?.current?.getEditor()?.editor?.delta);
    }

    if(!process.browser) return null;

    const ReactQuill = require('react-quill');
    const { Quill } = require('react-quill');
    
    if(process.browser) {
        const Font = ReactQuill.Quill.import('formats/font');
        Font.whitelist = ['pt-serif', 'public-sans', 'arial']

        ReactQuill.Quill.register(Font, true);

        const Size = ReactQuill.Quill.import('attributors/style/size');
        Size.whitelist = ['12px', '14px', '16px', '18px'];
        ReactQuill.Quill.register(Size, true);
    }

    return process.browser ? (
        <div className={styles.page}>
            <h2 
            //@ts-expect-error
            style={editor?.title_styles}
            >{editor?.name}</h2>

            <ReactQuill 
                ref={input_ref}
                tabIndex={1}
                theme={"snow"}
                //@ts-expect-error
                defaultValue={editor?.data} 
                placeholder={"Start Typing Here..."}
                onChange={handleChange}
                modules={{
                    toolbar: { container: '#toolbar-single' } 
                }}
                onBlur={(...args) => {
                    const selection = args[0];
                    
                    if(input_ref.current) {
                        // This cant happen all the time, only when the focus is removed by elements in the toolbar.

                        console.log(input_ref.current);
                        // input_ref.current.editor.selection.focus(); // Sets focus after blur
                        
                        //@ts-ignore
                        console.log(input_ref.current.editor.selection)
                    }
                }}
                scrollingContainer={`#EditorDocument`}
                />
        </div>
        
    ) : null;
}

export default Editor;