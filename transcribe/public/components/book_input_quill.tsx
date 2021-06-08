import { TextareaHTMLAttributes, useContext, useEffect, useRef, useState } from "react";
import styles from '../../styles/Home.module.css'
import { Chapter } from "../@types/book";
import BookContext from "../@types/book_context";
import BookParagraph from "./book_paragraph";

import _ from 'underscore'
import ReactQuill from "react-quill";

import parserHTML from 'parser-html'
import { toJSON, toDOM } from 'dom-to-json'
import { Search } from "react-feather";

const BookInputQuill: React.FC<{ value: Chapter, chapter: number }> = ({ value, chapter }) => {
    const { book, callback } = useContext(BookContext);
    const [ chapterState, setChapterState ] = useState(value); // Object Value
    const [ rawDataState, setRawDataState ] = useState('');

    const nextGeneration = (e) => {
        if(!e.children) return e.data
        
        return e.children.forEach(__ => {
            nextGeneration(__);
        });
    }   

    const reCreate = (e) => {
        console.log(e)
        return `<${e.name}>${e.data} ${e.children?.map(__ => reCreate(__))}</${e.name}>`
    }

    const handleChange = (raw_content) => {
        raw_content = raw_content.replace(/<br>/g, '<br></br>');
        console.log("[NEW]\n")

        // DOM Object
        const parsed = new DOMParser().parseFromString(raw_content, 'text/html');

        // JSON Object
        const json = toJSON(parsed);

        // DOM Object from JSON (TESTING)
        const comp = toDOM(json);

        // String from STE
        const serializer = new XMLSerializer();
        const re_string = serializer.serializeToString(parsed);

        // Full Loop
        console.log(raw_content, re_string)

        // DOM Parser can be used to create final book object, which can be displayed in a reading mode
        // before being printed or converted to PDF or Word Document (XML).

        // However, by using https://www.npmjs.com/package/dom-to-json - we can bypass the use of a DOM
        // And store the data as a steralized JSON format, better for data storage.

        parserHTML.parse(raw_content, (result) => {
            // Parser contains integrity conversion error where elements embeeded duoubly within a parent object
            // containing preceeding children, e.g. <p>Hello, <b>Sir</b> - What can i do for you</p>
            // the ' - What can i do for you' is lost. Fix immenently required; how? Idk.

            // Verify Integrity
            const integ = result?.forEach(element => {
                nextGeneration(element);
            });

            // Confirm No Data Loss
            const re_creation = result?.forEach(element => {
                return reCreate(element)
            });

            console.log("Compare \n\t", raw_content, "\n\t", re_creation)
        });


        return false;

        

        // Unneeded code, as of yet.
        // const content_ = [];

        // for(const element of e.target.children) {
        //     const styles = element.style.cssText;
        //     const content = element.textContent;

        //     const styles_obj = {};

        //     styles.split(";").forEach(e => {
        //         const duality = e.split(":");
        //         const key = snakeToCammel(duality[0]);
                
        //         if(key) styles_obj[snakeToCammel(duality[0])] = duality[1].trim();
        //     })

        //     content_.push({
        //         text: content,
        //         format: styles_obj
        //     })
        // }

        // setChapterState({ ...chapterState, content: content_ });
    }

    if(!process.browser) return null;

    const modules = {
        toolbar: {
          container: "#toolbar",
        },
        clipboard: {
          matchVisual: true,
        }
    };

    const logAndQuillIt = (_content) => {
        console.log(_content)

        handleChange(_content);
    }

    const ReactQuill = require('react-quill');
    return typeof window !== 'undefined' && ReactQuill ? (
        <ReactQuill 
            tabIndex={1}
            value={"Hmmmm"} 
            onChange={logAndQuillIt}
            theme={false}
            modules={modules}
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