import { useContext, useEffect, useRef, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import BookContext from "../@types/book_context";

import _ from 'underscore'
import ProjectContext from "@public/@types/project_context";
import { File, Folder } from "@public/@types/project";

const BookInputQuill: React.FC<{ value: File, chapter: number }> = ({ value, chapter }) => {
    const { editor, editorCallback } = useContext(ProjectContext);
    const { book, callback } = useContext(BookContext);

    if(!value) return <></>;

    const input_ref = useRef(null);

    useEffect(() => {
        //@ts-expect-error
        if(editor?.active_sub_file == value.id) {
            input_ref.current?.focus();
        }
        //@ts-expect-error
    }, [editor?.active_sub_file])

    const handleChange = (raw_content) => {
        if(input_ref?.current?.getEditor()?.editor?.delta == null || input_ref?.current?.getEditor()?.editor?.delta == undefined) return;
        
        const format = input_ref?.current?.getEditor().getFormat()

        if(Object.entries(format).length === 0) {
            input_ref?.current?.getEditor()?.format('color', "#202737");
            input_ref?.current?.getEditor()?.format('size', "11px");
            input_ref?.current?.getEditor()?.format('font', "public-sans");
        }
        
        // Set Data.
        value.data = input_ref?.current?.getEditor()?.editor?.delta;

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

    return process.browser ? (
        <ReactQuill 
            ref={input_ref}
            theme={"snow"}
            defaultValue={value?.data} 
            placeholder={"Start Typing Here..."}
            onChange={handleChange}
            modules={{
                // table: true, // npm i react-quill-with-table
                toolbar: { container: `#toolbar-${value.id}` } 
                    // handlers: {
                    //     customBold: function(value) {
                    //         console.log(this.quill)
                    //         this.quill.formatText(this.quill.selection.savedRange.index, this.quill.selection.savedRange.length, 'bold', 'bold', '');
                    //      }
                    // }
                
            }}
            onBlur={(...args) => {
                const selection = args[0];
                
                // if(input_ref.current) {
                //     // This cant happen all the time, only when the focus is removed by elements in the toolbar.

                //     console.log(input_ref.current);
                //     // input_ref.current.editor.selection.focus(); // Sets focus after blur
                    
                //     //@ts-ignore
                //     console.log(input_ref.current.editor.selection)
                // }
            }}
            onFocus={() => {
                

                //@ts-expect-error
                if(editor.active_sub_file != value.id) {
                    editorCallback({ ...editor, active_sub_file: value.id });
                }
            }}
            scrollingContainer={`#EditorDocument`}
            />
    ) : null;
}

export default BookInputQuill;