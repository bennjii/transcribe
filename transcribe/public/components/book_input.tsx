import { TextareaHTMLAttributes, useContext, useEffect, useRef, useState } from "react";
import styles from '../../styles/Home.module.css'
// import { Chapter } from "../@types/book";
import BookContext from "../@types/book_context";
import BookParagraph from "./book_paragraph";

import _ from 'underscore'

const BookInput: React.FC<{ value: any, chapter: number }> = ({ value, chapter }) => {
    const { book, callback } = useContext(BookContext);
    const [ chapterState, setChapterState ] = useState(value);

    const [ savedChapterState, setSavedChapterState ] = useState(value);

    // useEffect(() => {
    //     setChapterState(value);
    // }, [value])

    useEffect(() => {
        //@ts-expect-error
        callback({ ...book, chapters: [...book.chapters.slice(0, chapter), savedChapterState, ...book.chapters.slice(chapter+1, book.chapters.length)]});
    }, [savedChapterState])

    const createNewParagraph = (index, format, method) => {
        console.log("New paragraph!");
        
        if(method == 1) 
            chapterState.content.splice(index+1, 0, {
                text: '',
                format
            })
        else if(method == -1)
            chapterState.content.slice(index, index+1)
        
        //@ts-expect-error
        callback({ ...book, chapters: [ ...book.chapters.splice(0, chapter), chapterState, ...book.chapters.splice(chapter+1, book.chapters.length) ]});    
        setChapterState({ ...chapterState });
    }   

    const handleChange = (e) => {
        const content_ = [];

        for(const element of e.target.children) {
            const styles = element.style.cssText;
            const content = element.textContent;

            const styles_obj = {};

            styles.split(";").forEach(e => {
                const duality = e.split(":");
                const key = snakeToCammel(duality[0]);
                
                if(key) styles_obj[snakeToCammel(duality[0])] = duality[1].trim();
            })

            content_.push({
                text: content,
                format: styles_obj
            })
        }

        setSavedChapterState({ ...savedChapterState, content: content_ });
    }
    

    return (
        <span 
            className={styles.bookInput}
            contentEditable
            onInput={_.debounce(handleChange, 100)}
            >
                { 
                    chapterState.content.map((e, i) => {
                        return (
                            <BookParagraph key={`Chapter${chapter}Paragraph${i}`} content={e} paragraph={i} callback={createNewParagraph}/>
                        )
                    }) 
                }
        </span>
    )
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

export default BookInput;