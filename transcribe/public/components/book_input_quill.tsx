import { TextareaHTMLAttributes, useContext, useEffect, useRef, useState } from "react";
import styles from '../../styles/Home.module.css'
// import { Chapter } from "../@types/book";
import BookContext from "../@types/book_context";
import BookParagraph from "./book_paragraph";

import _ from 'underscore'
import ReactQuill from "react-quill";

import parserHTML from 'parser-html'
import { toJSON } from 'dom-to-json'
import { Search } from "react-feather";
import { JSONtoString, stringToJSON } from "./convert";

const BookInputQuill: React.FC<{ value: any, chapter: number }> = ({ value, chapter }) => {
    const { book, callback } = useContext(BookContext);
    const input_ref = useRef();
    const [ chapterState, setChapterState ] = useState(JSONtoString(value.content)); // Object Value
    const [ savedState, setSavedState ] = useState(null);

    useEffect(() => {
        console.log(savedState);

        // setChapterState(stringToJSON(rawDataState))
    }, [savedState])

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
        if(!raw_content) return false;

        // setSavedState(stringToJSON(raw_content));
        
        // DOM Parser can be used to create final book object, which can be displayed in a reading mode
        // before being printed or converted to PDF or Word Document (XML).

        // However, by using https://www.npmjs.com/package/dom-to-json - we can bypass the use of a DOM
        // And store the data as a steralized JSON format, better for data storage.
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
        handleChange(_content);
    }

    console.log(chapterState)

    const ReactQuill = require('react-quill');
    return typeof window !== 'undefined' && ReactQuill ? (
        <ReactQuill 
            ref={input_ref}
            tabIndex={1}
            value={chapterState} 
            onChange={logAndQuillIt}
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

const toDOM = obj => {
    if (typeof obj == 'string') {
        obj = JSON.parse(obj);
    }
    let node,
        nodeType = obj.nodeType;
    switch (nodeType) {
        case 1:
            //ELEMENT_NODE
            node = document.createElement(obj.tagName);
            let attributes = obj.attributes || [];
            for (let i = 0, len = attributes.length; i < len; i++) {
                const attr = attributes[i];
                node.setAttribute(attr[0], attr[1]);
            }
            break;
        case 3:
            //TEXT_NODE
            // eslint-disable-next-line no-undef
            node = document.createTextNode(obj.nodeValue);
            break;
        case 8:
            //COMMENT_NODE
            node = document.createComment(obj.nodeValue);
            break;
        case 9:
            //DOCUMENT_NODE
            node = document.implementation.createDocument(obj.nodeName, 'transcribe-dom');
            break;
        case 10:
            //DOCUMENT_TYPE_NODE
            node = document.implementation.createDocumentType(obj.nodeName, '', '');
            break;
        case 11:
            //DOCUMENT_FRAGMENT_NODE
            node = document.createDocumentFragment();
            break;
        default:
            return node;
    }
    if (nodeType == 1 || nodeType == 11) {
        const childNodes = obj.childNodes || [];
        for (let i = 0, len = childNodes.length; i < len; i++) {
            node.appendChild(toDOM(childNodes[i]));
        }
    }
    return node;
};

export default BookInputQuill;