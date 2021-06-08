import { TextareaHTMLAttributes, useContext, useEffect, useRef, useState } from "react";
import styles from '../../styles/Home.module.css'
import { Chapter } from "../@types/book";
import BookContext from "../@types/book_context";
import BookParagraph from "./book_paragraph";

import _ from 'underscore'
import ReactQuill from "react-quill";

import parserHTML from 'parser-html'

const BookInputQuill: React.FC<{ value: Chapter, chapter: number }> = ({ value, chapter }) => {
    const { book, callback } = useContext(BookContext);
    const [ chapterState, setChapterState ] = useState(value); // Object Value
    const [ rawDataState, setRawDataState ] = useState('');

    const nextGeneration = (e) => {
        console.log(e.name, e.data);

        e.children.forEach(__ => {
            nextGeneration(__);
        });
    }   

    const handleChange = (raw_content) => {
        parserHTML.parse(raw_content, (result) => {
            console.log(result);
            
            result?.forEach(element => {
                nextGeneration(element);
            });
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