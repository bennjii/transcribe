import { TextareaHTMLAttributes, useEffect, useRef, useState } from "react";
import { Bold, ChevronDown, Italic, Minus, Plus, Underline, Book as BookIcon, Share, Download } from "react-feather";

import styles from '../../styles/Home.module.css'
import { Book as BookType } from "../@types/book";
import { saveAs } from 'file-saver';

import BookContext from "../@types/book_context";
import BookChapter from "./book_chapter";

const Book: React.FC<{ content: BookType }> = ({ content }) => {
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
                
                if(typeof string !== 'string') return;
                
                if(e.content) word_count += (string?.trim().match(/\S+/g) || []).length
                if(e.content) char_count += (string?.trim().match(/\S/g) || []).length
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
                    <div className={styles.bookCaptionBar}>
                        <div>
                            <BookIcon size={18} color={"var(--acent-text-color)"} />

                            <p>Prologue</p>
                        </div>

                        <div className={styles.export} onClick={() => {
                                // var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
                                
                                // const { pdfExporter } = require('quill-to-pdf');
                                // const Epub = require("epub-gen");

                                // const htmlBookState = { ...bookState };

                                // bookState.chapters.forEach(async (e, i) => {
                                //     console.log(e.content);

                                //     const converter = new QuillDeltaToHtmlConverter(e.content.ops, { });
                                //     const html = converter.convert();

                                //     htmlBookState.chapters[i] = { data: html, title: e.title };

                                //     // console.log(html);
                                //     // const blob = await pdfExporter.generatePdf(e.content);
                                //     // saveAs(blob, 'publication.pdf');
                                // });

                                // new Epub(htmlBookState).promise.then(
                                //     (e) => {
                                //         console.log("Ebook Generated Successfully!");
                                //         console.log(e);
                                //     },
                                //     err => console.error("Failed to generate Ebook because of ", err)
                                // );
                            }}>

                            <Download size={18} color={"var(--text-muted)"} strokeWidth={1.5}  />

                            <p>Download</p>
                        </div>
                        

                        <div className={styles.fixedPageSpec}>
                            <Plus size={18} color={"var(--text-muted)"} strokeWidth={1} onClick={() => setEditorState({...editorState, zoom_level: editorState.zoom_level < 2.5 ? editorState.zoom_level + 0.1 : 2.5 })}/>

                            <p><b>{Math.round(editorState.zoom_level * 100)}%</b></p>

                            <Minus size={18} color={"var(--text-muted)"} strokeWidth={1} onClick={() => setEditorState({...editorState, zoom_level: editorState.zoom_level > 0.5 ? editorState.zoom_level - 0.1 : 0.5 })} />
                        </div>

                        <div className={styles.fixedPageSpec}>
                            <p><b>{editorState.pages}</b> Page</p>
                            <p><b>{editorState.words}</b> Words</p>
                            <p><b>{editorState.chars}</b> Characters</p>
                        </div>

                        
                    </div>

                    <div className={styles.pages} id={"Prologue"} style={{ zoom: `${editorState.zoom_level * 100}%` }}>
                        {
                            bookState.chapters.map((e, i: number) => {
                                return <BookChapter key={`Chapter${i}BOOK-CHAPTER`} chapter={i} content={e} />
                            })
                        }
                    </div>
                </div>
            </div>
        </BookContext.Provider>
    )
}

export default Book;