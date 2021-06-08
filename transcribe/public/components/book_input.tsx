import { TextareaHTMLAttributes, useContext, useEffect, useRef, useState } from "react";
import { ContentEditableEvent } from "react-contenteditable";
import { createNew } from "typescript";
import styles from '../../styles/Home.module.css'
import { Chapter } from "../@types/book";
import BookContext from "../@types/book_context";
import BookParagraph from "./book_paragraph";

const BookInput: React.FC<{ value: Chapter, chapter: number }> = ({ value, chapter }) => {
    const { book, callback } = useContext(BookContext);
    const [ chapterState, setChapterState ] = useState(value);

    useEffect(() => {
        setChapterState(value);
    }, [value])

    const createNewParagraph = (index, format, method) => {
        console.log("New paragraph!");
        
        if(method == 1) 
            chapterState.content.splice(index+1, 0, {
                text: '',
                format
            })
        else if(method == -1)
            chapterState.content.slice(index, index+1)
        
        callback({ ...book, chapters: [ ...book.chapters.splice(0, chapter), chapterState, ...book.chapters.splice(chapter+1, book.chapters.length) ]});    
        setChapterState({ ...chapterState });
    }   

    return (
        <div 
            className={styles.bookInput}
            contentEditable
            onInput={(e) => {
                console.log(e.target.children)
            }}
            >
                { 
                    chapterState.content.map((e, i) => {
                        return (
                            <BookParagraph key={`Chapter${chapter}Paragraph${i}`} content={e} paragraph={i} callback={createNewParagraph}/>
                        )
                    }) 
                }
        </div>
    )
}

export default BookInput;