import { memo, TextareaHTMLAttributes, useEffect, useRef, useState } from "react";
import { Bold, ChevronDown, Italic, Minus, Plus, Underline, Book as BookIcon, Share, Download, Menu, BookOpen, Settings, Edit3, Clipboard } from "react-feather";

import styles from '../../styles/Home.module.css'
import { Book as BookType } from "../@types/book";
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';

import BookContext from "../@types/book_context";
import BookChapter from "./book_chapter";
import { useContext } from "react";
import ProjectContext from "@public/@types/project_context";
import Editor from "./editor";
import { File, Folder, newCanvasItem, Project } from "@public/@types/project";
import ReactQuill, { Quill } from "react-quill";

import Delta from 'quill-delta'
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import jsPDF from "jspdf";
import { CssBaseline, Divider, Grid, Modal, Radio, Text, useModal } from "@geist-ui/react";
import BookDocument from "./book_document";
import ExportModal from "./export_modal";
import PrefrenceModal from "./preference_modal";
import VisionCanvas from "./vision_canvas";

const VisionBoard: React.FC<{ viewOnly?: boolean }> = ({ viewOnly }) => {
    const { project, projectCallback, editor, editorCallback } = useContext(ProjectContext);

    const [ bookState, setBookState ] = useState<File | Folder>(null);
    const [ editorState, setEditorState ] = useState({
        words: 0,
        chars: 0,
        chapters: bookState?.type == "book" ? bookState.children.length : 0,
        chapter: 0,
        zoom_level: 1
    });
    
    useEffect(() => {
        setBookState(editor);
    }, [editor]);

    useEffect(() => {
        // Book has been updated! Let's propogate the changes up the tree, to the root project node.
        if(bookState && !viewOnly) {
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

                    word_count += (html?.trim().match(/(\w+[^>\s])/g) || []).length;
                    char_count += (html?.trim().match(/\S/g) || []).length;
                }
            });
        }else {
            //@ts-expect-error
            if(!editor?.is_folder && editor?.data) {
                //@ts-expect-error
                const html = new QuillDeltaToHtmlConverter(editor.data.ops, {}).convert();

                word_count += (html?.trim().match(/(\w+[^>\s])/g) || []).length;
                char_count += (html?.trim().match(/\S/g) || []).length;
            }
        }

        setEditorState({ ...editorState, words: word_count, chars: char_count, chapters: bookState?.type == "book" ? bookState.children.length : 0 });

        localStorage.setItem(`transcribe-editor_${editor?.id}`, JSON.stringify(bookState));
    }, [, bookState]);

    const { visible: exportVisible, setVisible: setExportVisible, bindings: exportBindings } = useModal();
    const { visible: prefrencesVisible, setVisible: setPrefrencesVisible, bindings: prefrenceBindings } = useModal();

    return (
        <BookContext.Provider value={{ book: bookState, callback: setBookState, viewOnly: viewOnly }}>
            <div className={styles.editorContent} >
                {/* Content... */}

                <ExportModal modal={{ exportVisible, setExportVisible, exportBindings }}/>
                <PrefrenceModal modal={{ prefrencesVisible, setPrefrencesVisible, prefrenceBindings }}/>

                <div className={styles.book}>			
                    <div className={styles.bookCaptionBar}>
                        <div>
                            <Clipboard size={18} color={"var(--acent-text-color)"} />

                            <p>{editor?.name}</p>
                        </div>

                        <div className={styles.centerActions}>
                            {
                                !viewOnly ? 
                                <div className={styles.addChapter} onClick={() => {
                                    //@ts-expect-error
                                    bookState?.data.push(newCanvasItem("...", "text"))

                                    projectCallback({
                                        ...project,
                                        file_structure: {
                                            ...project.file_structure
                                        }
                                    })
                                }}>
                                    <Plus size={18} color={"var(--text-muted)"} strokeWidth={1.5}  />

                                    <p>Add Item</p>
                                </div>
                                :
                                <></>
                            }

                            <div className={styles.export} onClick={async () => {
                                setExportVisible(!exportVisible);

                            }}>
                                <Download size={18} color={"var(--text-muted)"} strokeWidth={1.5} />

                                <p>Export</p>
                            </div>

                            {
                                !viewOnly ?
                                <div className={styles.export} onClick={async () => {
                                    setPrefrencesVisible(true)
                                }}>
                                    <Edit3 size={18} color={"var(--text-muted)"} strokeWidth={1.5} />
    
                                    <p>Prefrences</p>
                                </div>
                                :
                                <></>
                            }
                            
                        </div>
                        

                        <div className={styles.fixedPageSpec}>
                            <Plus size={18} color={"var(--text-muted)"} strokeWidth={1} onClick={() => setEditorState({...editorState, zoom_level: editorState.zoom_level < 2.5 ? editorState.zoom_level + 0.1 : 2.5 })}/>

                            <p><b>{Math.round(editorState.zoom_level * 100)}%</b></p>

                            <Minus size={18} color={"var(--text-muted)"} strokeWidth={1} onClick={() => setEditorState({...editorState, zoom_level: editorState.zoom_level > 0.5 ? editorState.zoom_level - 0.1 : 0.5 })} />
                        </div>

                        <div className={styles.fixedPageSpec} style={{ justifyContent: "flex-end" }}>
                            { bookState?.type == "book" ? <p><b>{editorState.chapters}</b> {editorState.chapters > 1 ? "Chapters" : "Chapter"}</p> : <></> }
                            <p><b>{editorState.words}</b> Words</p>
                            <p><b>{editorState.chars}</b> Characters</p>
                        </div>
                    </div>
                    
                    <div className={styles.visionPage} id={"EditorDocument"} style={{ zoom: `${editorState.zoom_level * 100}%` }}>
                        <VisionCanvas />
                    </div>
                </div>
            </div>
        </BookContext.Provider>
    )
}

export default VisionBoard;