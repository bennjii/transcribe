import { memo, TextareaHTMLAttributes, useEffect, useRef, useState } from "react";
import { Bold, ChevronDown, Italic, Minus, Plus, Underline, Book as BookIcon, Share, Download } from "react-feather";

import styles from '../../styles/Home.module.css'
import { Book as BookType } from "../@types/book";
import { saveAs } from 'file-saver';

import BookContext from "../@types/book_context";
import BookChapter from "./book_chapter";
import { useContext } from "react";
import ProjectContext from "@public/@types/project_context";
import Editor from "./editor";
import { File, Folder, Project } from "@public/@types/project";
import ReactQuill, { Quill } from "react-quill";

import Delta from 'quill-delta'
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

const Book: React.FC<{ }> = ({  }) => {
    const { project, projectCallback, editor, editorCallback } = useContext(ProjectContext);

    const [ bookState, setBookState ] = useState<File | Folder>(null);
    const [ editorState, setEditorState ] = useState({
        words: 0,
        chars: 0,
        pages: 1,
        chapter: 0,
        zoom_level: 1.5
    });
    
    useEffect(() => {
        setBookState(editor);
    }, [editor]);

    useEffect(() => {
        

        // Book has been updated, lets update the character and word counts.
        // if(bookState?.children) {
        //     bookState?.children.forEach(e => {
        //         console.log(e.data)
        //         // e.data?.ops.forEach(_e => {
        //         //     const string = _e.insert;
                    
        //         //     if(typeof string !== 'string') return;
                    
        //         //     if(e.content) word_count += (string?.trim().match(/\S+/g) || []).length
        //         //     if(e.content) char_count += (string?.trim().match(/\S/g) || []).length
        //         // })
        //     });
        // }
            
        // else
        //     bookState.data.ops.forEach(_e => {
        //         const string = _e.insert;
                
        //         if(typeof string !== 'string') return;
                
        //         if(e.content) word_count += (string?.trim().match(/\S+/g) || []).length
        //         if(e.content) char_count += (string?.trim().match(/\S/g) || []).length
        //     });


        // Book has been updated! Let's propogate the changes up the tree, to the root project node.
        if(bookState) {
            let updated_file = JSON.parse(JSON.stringify(project.file_structure));

            // Loop & Replace Relevancy
            const rec = (element, state: Project) => {
                return element?.children?.forEach((_element, i) => {
                    if(_element.id == bookState.id) element.children[i] = bookState;
            
                    if(_element.id == bookState.id) return;
                    else return rec(_element, state);
                });
            }

            rec(updated_file, project);
    
            // Propogate Changes!
            projectCallback({
                ...project,
                file_structure: updated_file
            })
        }

        let word_count = 0;
        let char_count = 0;

        // For Exporting, Concatonate all deltas with a splicing intermediary.
        // https://github.com/quilljs/delta/#concat

        //@ts-expect-error
        if(editor?.children) {
            //@ts-expect-error
            editor.children.forEach(element => {
                if(element.data) {
                    const html = new QuillDeltaToHtmlConverter(element.data.ops, {}).convert();

                    console.log(html);

                    word_count += (html?.trim().match(/(\w+[^>\s])/g) || []).length;
                    char_count += (html?.trim().match(/\S/g) || []).length;
                }
            });
        }

        setEditorState({ ...editorState, words: word_count, chars: char_count });

        localStorage.setItem(`transcribe-editor_${editor?.id}`, JSON.stringify(bookState));
    }, [bookState])

    const MemoEditor = memo((props: any) => {
        return (
            props ?     
                props?.type == "book" && props?.active_sub_file
                ?
                    props?.children?.map((chapter: File, index: number) => {
                        return <BookChapter key={`Chapter${index}BOOK-CHAPTER`} chapter={index} content={chapter} />
                    })
                :
                    <Editor />
            :
                <></>
        )
    })

    return (
        <BookContext.Provider value={{ book: bookState, callback: setBookState }}>
            <div className={styles.editorContent}>
                {/* Content... */}

                <div className={styles.book}>			
                    <div className={styles.bookCaptionBar}>
                        <div>
                            <BookIcon size={18} color={"var(--acent-text-color)"} />

                            <p>{editor?.name}</p>
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

                        <div className={styles.fixedPageSpec} style={{ justifyContent: "flex-end" }}>
                            <p><b>{editorState.pages}</b> Page</p>
                            <p><b>{editorState.words}</b> Words</p>
                            <p><b>{editorState.chars}</b> Characters</p>
                        </div>
                    </div>
                    
                    <div className={styles.pages} id={"EditorDocument"} style={{ zoom: `${editorState.zoom_level * 100}%` }}>
                        {  
                            editor?.type == "book" && editor?.active_sub_file
                            ?
                            editor?.children?.map((chapter: File, index: number) => {
                                return <BookChapter key={`Chapter${index}BOOK-CHAPTER`} chapter={index} content={chapter} />
                            })
                            :
                            <Editor />
                        }
                    </div>
                </div>
            </div>
        </BookContext.Provider>
    )
}

export default Book;