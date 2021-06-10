import { TextareaHTMLAttributes, useEffect, useRef, useState } from "react";
import { Bold, ChevronDown, Italic, Minus, Plus, Underline } from "react-feather";

import styles from '../../styles/Home.module.css'
import { Book as BookType } from "../@types/book";

import BookContext from "../@types/book_context";
import BookChapter from "./book_chapter";

import CustomToolbar from "./custom_toolbar";

const Book: React.FC<{ content: BookType }> = ({ content }) => {
    console.log("recieved", content)
    const [ bookState, setBookState ] = useState(content);
    const [ editorState, setEditorState ] = useState({
        words: 0,
        chars: 0,
        pages: 1,
        chapter: 0,
        zoom_level: 1.5
    });
    
    useEffect(() => {
        let word_count = 0;
        let char_count = 0;

        bookState.chapters.forEach(e => {
            e.content.ops.forEach(_e => {
                const string = _e.insert;

                if(e.content) word_count += (string.trim().match(/\S+/g) || []).length
                if(e.content) char_count += (string.trim().match(/\S/g) || []).length
            })
        });

        setEditorState({ ...editorState, words: word_count, chars: char_count });

        localStorage.setItem(`transcribe-editor_${'1'}`, JSON.stringify(bookState));
    }, [bookState]);

    return (
        <BookContext.Provider value={{ book: bookState, callback: setBookState }}>
            <div className={styles.editorContent}>
                {/* Content... */}

                <div className={styles.book}>			
                    <div className={styles.bookOverTools}>
                        <h2>Publication</h2>

                        <div className={styles.bookToolTable}> 
                            <CustomToolbar />
                        </div>

                        <div className={styles.syncStatus}>
                            Saved

                            <div className={styles.syncTrue}>

                            </div>
                        </div>
                    </div>

                    <div className={styles.pages} style={{ zoom: `${editorState.zoom_level * 100}%` }}>
                        {
                            bookState.chapters.map((e, i: number) => {
                                return <BookChapter key={`Chapter${i}BOOK-CHAPTER`} chapter={i} content={e} />
                            })
                        }
                    </div>

                    <div className={styles.bookStats}>
                        <p>Chapter {editorState.chapter+1}</p>

                        <div>
                            <p>{editorState.pages} Page</p>
                            <p>{editorState.words} Words</p>
                            <p>{editorState.chars} Characters</p>
                        </div>

                        <div>
                            <Plus size={18} onClick={() => setEditorState({...editorState, zoom_level: editorState.zoom_level < 2.5 ? editorState.zoom_level + 0.1 : 2.5 })}/>
                            <Minus size={18} onClick={() => setEditorState({...editorState, zoom_level: editorState.zoom_level > 0.5 ? editorState.zoom_level - 0.1 : 0.5 })} />
                        </div>
                    </div>  
                    
                </div>

                {/* <div className={styles.bookTools}>
                    helper
                </div> */}
            </div>
        </BookContext.Provider>
    )
}

export default Book;