import { TextareaHTMLAttributes, useRef, useState } from "react";
import { Bold, ChevronDown, Italic, Underline } from "react-feather";
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
                    <div className={styles.bookOverTools}>
                        <h2>Publication</h2>

                        <div className={styles.bookToolTable}> 
                            <div className={styles.selector}>
                                PT Serif

                                <ChevronDown size={18}/>
                            </div>
                            <Bold size={18}/>
                            <Italic size={18}/>
                            <Underline size={18}/>
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
                        <p>Chapter 1</p>

                        <div>
                            <p>1 Page</p>
                            <p>53 Words</p>
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