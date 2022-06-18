import { useContext, useEffect, useRef, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import BookContext from "../@types/book_context";

import _ from 'underscore'
import ProjectContext from "@public/@types/project_context";
import { File, Folder } from "@public/@types/project";

const BookInputQuill: React.FC<{ value: File, chapter: number }> = ({ value, chapter }) => {
    const { editors, editorsCallback } = useContext(ProjectContext);
    const { book, callback, viewOnly } = useContext(BookContext);

    const [ bookState, setBookState ] = useState<File | Folder>(null);

    useEffect(() => {
        const ed = editors.findIndex((e: File | Folder) => e.id == value.id);
        if(!ed) {
            const ed2 = editors.findIndex((e) => (e as unknown as Folder)?.active_sub_file == value.id);
            setBookState(editors[ed2]);
        }else {
            setBookState(editors[ed]);
        }
    }, [editors]);

    if(!value) return <></>;

    const input_ref = useRef(null);

    useEffect(() => {
        //@ts-expect-error
        if(bookState?.active_sub_file == value.id) {
            input_ref.current?.focus();
        }
    }, [bookState])

    const handleChange = (raw_content) => {
        if(input_ref?.current?.getEditor()?.editor?.delta == null || input_ref?.current?.getEditor()?.editor?.delta == undefined) return;
        
        const editor = input_ref?.current?.getEditor();

        if(editor) {
            editor.update();
            const format = editor.getFormat();

            if(Object.entries(format).length === 0) {
                editor.format('color', "#202737");
                editor.format('size', "11px");
                editor.format('font', "public-sans");
            }
        }
        
        // Set Data.
        value.data = input_ref?.current?.getEditor()?.editor?.delta;

        callback({
            ...book
        });
    }

    if(!process.browser) return null;

    const ReactQuill = require('react-quill');

    return process.browser ? (
        <ReactQuill 
            readOnly={viewOnly}
            ref={input_ref}
            theme={"snow"}
            defaultValue={value?.data} 
            placeholder={"Start Typing Here..."}
            onChange={handleChange}
            modules={{
                // table: true, // npm i react-quill-with-table
                toolbar: false,
                    // handlers: {
                    //     customBold: function(value) {
                    //         console.log(this.quill)
                    //         this.quill.formatText(this.quill.selection.savedRange.index, this.quill.selection.savedRange.length, 'bold', 'bold', '');
                    //      }
                    // }
                
            }}
            onFocus={() => {
                //@ts-expect-error
                if(bookState?.active_sub_file != value.id) {
                    if(bookState.type == "folder") {
                        const new_book_state = bookState; 
                        new_book_state.active_sub_file = value.id;

                        const new_book = editors.map((e: File | Folder) => {
                            if(e.id == value.id) {
                                e = new_book_state;
                            }
                        });

                        editorsCallback(new_book);
                    }
                }
            }}
            scrollingContainer={`#EditorDocument`}
            />
    ) : null;
}

export default BookInputQuill;