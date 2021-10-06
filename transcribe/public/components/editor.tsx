import { useContext, useEffect, useRef, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import BookContext from "../@types/book_context";

import _ from 'underscore'
import ProjectContext from "@public/@types/project_context";
import { File } from "@public/@types/project";

import styles from '@styles/Home.module.css'

const Editor: React.FC<{ value: File }> = ({ value }) => {
    const { editor, project, editorCallback } = useContext(ProjectContext);
    const { book, callback, viewOnly } = useContext(BookContext);

    const input_ref = useRef(null);
    const title_ref = useRef(null);

    useEffect(() => {
        input_ref.current?.focus();
    }, [project?.active_file])

    const handleChange = (raw_content) => {
        if(input_ref?.current?.getEditor()?.editor?.delta == null || input_ref?.current?.getEditor()?.editor?.delta == undefined) return;

        const format = input_ref?.current?.getEditor().getFormat()
        console.log(format);

        if(Object.entries(format).length === 0) {
            input_ref?.current?.getEditor()?.format('color', "#202737");
            input_ref?.current?.getEditor()?.format('size', "11px");
            input_ref?.current?.getEditor()?.format('font', "public-sans");
        }

        //@ts-expect-error
        editor.data = input_ref?.current?.getEditor()?.editor?.delta;

        //@ts-expect-error
        book.data = input_ref?.current?.getEditor()?.editor?.delta;

        callback({
            ...book
        });
    }

    if(!process.browser) return null;

    const ReactQuill = require('react-quill');
    const { Quill } = require('react-quill');
    
    if(process.browser) {
        const Font = ReactQuill.Quill.import('formats/font');
        Font.whitelist = ['pt-serif', 'public-sans', 'arial', 'times-new-roman']

        ReactQuill.Quill.register(Font, true);

        const Size = ReactQuill.Quill.import('attributors/style/size');
        Size.whitelist = ['11px', '12px', '13px', '14px', '16px', '18px'];
        ReactQuill.Quill.register(Size, true);
    }

    //@ts-expect-error
    return process.browser && editor?.data ? (
        <ReactQuill 
            readOnly={viewOnly}
            ref={input_ref}
            theme={"snow"}
            //@ts-expect-error
            defaultValue={editor?.data} 
            placeholder={"Start Typing Here..."}
            onChange={handleChange}
            modules={{
                // table: true, // npm i react-quill-with-table
                toolbar: { container: `#toolbar-single` } 
                    // handlers: {
                    //     customBold: function(value) {
                    //         console.log(this.quill)
                    //         this.quill.formatText(this.quill.selection.savedRange.index, this.quill.selection.savedRange.length, 'bold', 'bold', '');
                    //      }
                    // }
                
            }}
            onBlur={(...args) => {
                const selection = args[0];
            }}
            scrollingContainer={`#EditorDocument`}
            />  
    ) : null;
}

export default Editor;