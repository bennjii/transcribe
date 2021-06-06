import { TextareaHTMLAttributes, useRef, useState } from "react";
import styles from '../../styles/Home.module.css'
import { Book as BookType, Chapter } from "../@types/book";
import BookContext from "../@types/book_context";
import BookChapter from "./book_chapter";
import BookInput from "./book_input";

const Book: React.FC<{ content: BookType }> = ({ content }) => {
    const [ bookState, setBookState ] = useState(content);

    return (
        <BookContext.Provider value={{ book: bookState, callback: setBookState }}>
            <div className={styles.editorContent}>
                {/* Content... */}

                <div className={styles.book}>			
                    {
                        bookState.chapters.map((e: Chapter, i: number) => {
                            return <BookChapter chapter={i} content={e} />
                        })
                    }
                </div>

                <div className={styles.bookTools}>
                    helper
                </div>
            </div>
        </BookContext.Provider>
    )
}

export default Book;