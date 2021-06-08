import { TextareaHTMLAttributes, useEffect, useRef, useState } from "react";
import { Bold, ChevronDown, Italic, Underline } from "react-feather";
import styles from '../../styles/Home.module.css'
import { Book as BookType, Chapter } from "../@types/book";
import BookContext from "../@types/book_context";
import BookChapter from "./book_chapter";
import BookInput from "./book_input";
import CustomToolbar from "./custom_toolbar";

const Book: React.FC<{ content: BookType }> = ({ content }) => {
    const [ bookState, setBookState ] = useState(content);
    const [ editorState, setEditorState ] = useState({
        words: 0,
        pages: 1,
        chapter: 0
    });
    
    useEffect(() => {
        let word_count = 0;

        bookState.chapters.forEach(e => {
            e.content.forEach(_e => {
                word_count += (_e.text.trim().match(/\s/g) || []).length
            });
        });

        setEditorState({ ...editorState, words: word_count })
    }, [bookState]);

    return (
        <BookContext.Provider value={{ book: bookState, callback: setBookState }}>
            <div className={styles.editorContent}>
                {/* Content... */}

                <div className={styles.book}>			
                    <div className={styles.bookOverTools}>
                        <h2>Publication</h2>

                        <div className={styles.bookToolTable}> 
                            <div className={styles.selector}>
                                PT Serif

                                <ChevronDown size={18}/>
                            </div>
                            <CustomToolbar />
                        </div>

                        <div className={styles.syncStatus}>
                            Saved

                            <div className={styles.syncTrue}>

                            </div>
                        </div>
                    </div>

                    <div className={styles.pages}>
                        {
                            bookState.chapters.map((e: Chapter, i: number) => {
                                return <BookChapter key={`Chapter${i}BOOK-CHAPTER`} chapter={i} content={e} />
                            })
                        }
                    </div>

                    <div className={styles.bookStats}>
                        <p>Chapter {editorState.chapter+1}</p>

                        <div>
                            <p>{editorState.pages} Page</p>
                            <p>{editorState.words} Words</p>
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