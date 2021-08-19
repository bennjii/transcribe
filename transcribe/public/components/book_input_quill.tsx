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

    const input_ref = useRef();

    const [ chapterState, setChapterState ] = useState(value?.data); // Object Value
    const [ savedState, setSavedState ] = useState(null);

    useEffect(() => {
        setChapterState(value?.data)
    }, [value])

    const handleChange = (raw_content) => {
        //@ts-expect-error
        setChapterState(input_ref?.current?.getEditor()?.editor?.delta);

        // if(!raw_content) return false;
        
        //@ts-expect-error
        setSavedState(input_ref?.current?.getEditor()?.editor?.delta);

        console.log(book.type)

        

        if(book.type == "book") {
            const index = book.children.findIndex(e => e.id == value.id)

            if(~index) {
                callback({
                    ...book,
                    children: [...book.children.slice(0, index - 1), { ...value, data: chapterState } , ...book.children.slice(index - 1, book.children.length) ]
                })
            }
        }
        
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
        <ReactQuill 
            ref={input_ref}
            tabIndex={1}
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
                
                if(input_ref.current) {
                    // This cant happen all the time, only when the focus is removed by elements in the toolbar.

                    console.log(input_ref.current);
                    // input_ref.current.editor.selection.focus(); // Sets focus after blur
                    
                    //@ts-ignore
                    console.log(input_ref.current.editor.selection)
                }
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