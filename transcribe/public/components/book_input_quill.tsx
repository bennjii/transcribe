import { TextareaHTMLAttributes, useContext, useEffect, useRef, useState } from "react";
import styles from '../../styles/Home.module.css'
import 'react-quill/dist/quill.snow.css';
import BookContext from "../@types/book_context";

import _ from 'underscore'
import ReactQuill, {Quill} from 'react-quill';

import { JSONtoString, stringToJSON } from "./convert";

const BookInputQuill: React.FC<{ value: any, chapter: number }> = ({ value, chapter }) => {
    const { book, callback } = useContext(BookContext);
    const input_ref = useRef();

    const [ chapterState, setChapterState ] = useState(value.content); // Object Value
    const [ savedState, setSavedState ] = useState(null);

    useEffect(() => {
        if(!savedState) return;

        callback({ ...book, chapters: [ ...book.chapters.splice(0, chapter), { ...value, content: savedState }, ...book.chapters.splice(chapter+1, book.chapters.length) ]})
    }, [savedState])

    const handleChange = (raw_content) => {
        //@ts-expect-error
        setChapterState(input_ref?.current?.getEditor()?.editor?.delta);

        // if(!raw_content) return false;
        
        //@ts-expect-error
        setSavedState(input_ref?.current?.getEditor()?.editor?.delta);
        
        // DOM Parser can be used to create final book object, which can be displayed in a reading mode
        // before being printed or converted to PDF or Word Document (XML).

        // However, by using https://www.npmjs.com/package/dom-to-json - we can bypass the use of a DOM
        // And store the data as a steralized JSON format, better for data storage.
    }

    if(!process.browser) return null;

    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote'],                // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
    
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'font': [] }],
        [{ 'align': [] }],
      
        ['clean']                                         // remove formatting button
      ];

    const ReactQuill = require('react-quill');
    const { Quill } = require('react-quill');
    
    if(process.browser) {
        const Font = ReactQuill.Quill.import('formats/font');
        Font.whitelist = ['pt-serif', 'public-sans', 'arial']

        ReactQuill.Quill.register(Font, true);
    }

    return process.browser ? (
        <ReactQuill 
            ref={input_ref}
            tabIndex={1}
            theme={"snow"}
            defaultValue={chapterState} 
            onChange={handleChange}
            modules={{
                // table: true,
                toolbar: { container: '#toolbar' }  // Selector for toolbar container
                    // handlers: {
                    //     customBold: function(value) {
                    //         console.log(this.quill)
                    //         this.quill.formatText(this.quill.selection.savedRange.index, this.quill.selection.savedRange.length, 'bold', 'bold', '');
                    //      }
                    // }
                ,
                /// TAB INSERT \t
            }}
            />
    ) : null;
}

export default BookInputQuill;