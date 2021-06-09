import { TextareaHTMLAttributes, useContext, useEffect, useRef, useState } from "react";
import styles from '../../styles/Home.module.css'
import BookContext from "../@types/book_context";

import _ from 'underscore'
import ReactQuill, {Quill} from 'react-quill';

import { JSONtoString, stringToJSON } from "./convert";

const BookInputQuill: React.FC<{ value: any, chapter: number }> = ({ value, chapter }) => {
    const { book, callback } = useContext(BookContext);
    const input_ref = useRef();

    const [ chapterState, setChapterState ] = useState(JSONtoString(value.content)); // Object Value
    const [ savedState, setSavedState ] = useState(null);

    useEffect(() => {
        console.log(savedState);

        setChapterState(savedState)
    }, [savedState])

    const handleChange = (raw_content) => {
        if(!raw_content) return false;

        setSavedState(stringToJSON(raw_content));
        
        // DOM Parser can be used to create final book object, which can be displayed in a reading mode
        // before being printed or converted to PDF or Word Document (XML).

        // However, by using https://www.npmjs.com/package/dom-to-json - we can bypass the use of a DOM
        // And store the data as a steralized JSON format, better for data storage.
    }

    if(!process.browser) return null;

    const ReactQuill = require('react-quill');
    return process.browser ? (
        <ReactQuill 
            ref={input_ref}
            tabIndex={1}
            theme={"snow"}
            defaultValue={chapterState} 
            onChange={handleChange}
            modules={{
                toolbar: {
                    container: '#toolbar',  // Selector for toolbar container
                    // handlers: {
                    //     customBold: function(value) {
                    //         console.log(this.quill)
                    //         this.quill.formatText(this.quill.selection.savedRange.index, this.quill.selection.savedRange.length, 'bold', 'bold', '');
                    //      }
                    // }
                },
                /// TAB INSERT \t
            }}
            />
    ) : null;
}

const snakeToCammel = (name: string) => {
    name = name.replace(/"/g, "");
    name = name.trim();

    if(name !== "")
        return name.replace(/(\-\w)/g, function(m) {
            return m[1].toUpperCase()
        });
    else return null;
}

export default BookInputQuill;