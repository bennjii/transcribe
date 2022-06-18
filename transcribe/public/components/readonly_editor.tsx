import { useContext, useEffect, useRef, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import BookContext from "../@types/book_context";

import _ from 'underscore'
import ProjectContext from "@public/@types/project_context";
import { File } from "@public/@types/project";

const ReadonlyEditor: React.FC<{ value: File }> = ({ value }) => {
    const { project } = useContext(ProjectContext);
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

        value.data = input_ref?.current?.getEditor()?.editor?.delta;

        //@ts-expect-error
        book.data = input_ref?.current?.getEditor()?.editor?.delta;

        callback({
            ...book
        });
    }

    if(!process.browser) return null;

    const ReactQuill = require('react-quill');

    return process.browser && value?.data ? (
        <ReactQuill 
            readOnly={true}
            ref={input_ref}
            theme={"snow"}
            defaultValue={value?.data} 
            placeholder={"Start Typing Here..."}
            modules={{
                toolbar: false
            }}
            scrollingContainer={`#EditorDocument`}
            />  
    ) : null;
}

export default ReadonlyEditor;