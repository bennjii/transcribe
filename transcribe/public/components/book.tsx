import { memo, TextareaHTMLAttributes, useEffect, useRef, useState } from "react";
import { Bold, ChevronDown, Italic, Minus, Plus, Underline, Book as BookIcon, Share, Download, Menu, BookOpen, Settings, Edit3, File as FileIcon, Sun, Sunrise, Edit, Eye } from "react-feather";

import styles from '../../styles/Home.module.css'
import BookContext from "../@types/book_context";
import BookChapter from "./book_chapter";
import { useContext } from "react";
import ProjectContext from "@public/@types/project_context";
import { File, Folder, newChapter, Project } from "@public/@types/project";

import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import BookDocument from "./book_document";
import ExportModal from "./export_modal";
import PreferenceModal from "./preference_modal";
import { useModal } from "@geist-ui/react";
import VisualPreferenceModal from "./visual_preference_modal";

const Book: React.FC<{ viewOnly?: boolean }> = ({ viewOnly }) => {
    const { project, projectCallback, editor, editorCallback } = useContext(ProjectContext);

    const [ bookState, setBookState ] = useState<File | Folder>(null);
    const [ editorState, setEditorState ] = useState({
        words: 0,
        chars: 0,
        chapters: bookState?.type == "book" ? bookState.children.length : 0,
        chapter: 0,
        zoom_level: 1.5
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
    
            // Propagate Changes!
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
    const { visible: preferencesVisible, setVisible: setPreferencesVisible, bindings: preferenceBindings } = useModal();
    const { visible: vpVisible, setVisible: setVPVisible, bindings: vpBindings } = useModal();

    return (
        <BookContext.Provider value={{ book: bookState, callback: setBookState, viewOnly: viewOnly }}>
            <div className={`h-full flex flex-row flex-1 overflow-hidden ${editor?.settings?.theme == "light" ? "" : "bg-bgDarkDark"}`}>
                {/* Content... */}

                <ExportModal modal={{ exportVisible, setExportVisible, exportBindings }}/>
                <PreferenceModal modal={{ preferencesVisible, setPreferencesVisible, preferenceBindings }}/>
                <VisualPreferenceModal modal={{ vpVisible, setVPVisible, vpBindings }}/>

                <div className="flex flex-col h-screen w-full relative">			
                    <div className="h-10 flex flex-row items-center justify-between gap-2 px-4">
                        <div className="select-none w-72 flex flex-row items-center gap-2">
                            {
                                editor?.type == "book" ? 
                                <BookIcon size={18} color={editor?.settings?.theme == "light" ? "var(--acent-text-color)" : "var(--text-muted)"} />
                                :
                                <FileIcon size={18} color={editor?.settings?.theme == "light" ? "var(--acent-text-color)" : "var(--text-muted)"} />
                            }

                            <p className="font-normal text-textMuted text-sm">{editor?.name}</p>
                        </div>

                        <div className={styles.centerActions}>
                            {
                                bookState?.type == "book" && !viewOnly ? 
                                <div className={styles.addChapter} onClick={() => {
                                    //@ts-expect-error
                                    bookState?.children.push(newChapter())

                                    projectCallback({
                                        ...project
                                    })
                                }}>
                                    <Plus size={18} color={"var(--text-muted)"} strokeWidth={1.5}  />

                                    <p className="font-normal text-textMuted select-none text-xs">Add Chapter</p>
                                </div>
                                :
                                <></>
                            }
                            
                            {
                                !viewOnly ?
                                <div className={styles.export} onClick={async () => {
                                    setExportVisible(!exportVisible)
                                }}>
                                    <Download size={18} color={"var(--text-muted)"} strokeWidth={1.5} />
    
                                    <p className="font-normal text-textMuted select-none text-xs">Export</p>
                                </div>
                                :
                                <></>
                            }

                            {
                                !viewOnly ?
                                <div className={styles.export} onClick={async () => {
                                    setPreferencesVisible(true)
                                }}>
                                    <Edit3 size={18} color={"var(--text-muted)"} strokeWidth={1.5} />
    
                                    <p className="font-normal text-textMuted select-none text-xs">Options</p>
                                </div>
                                :
                                <></>
                            }

                            {
                                !viewOnly ?
                                <div className={styles.export} onClick={async () => {
                                    setVPVisible(!vpVisible)
                                }}>
                                    <Eye size={18} color={"var(--text-muted)"} strokeWidth={1.5} />

                                    <p className="font-normal text-textMuted select-none text-xs">Preferences</p>
                                </div>
                                :
                                <></>
                            }
                        </div>

                        <div className="flex flex-row items-center gap-2 select-none">
                            <Plus size={18} color={"var(--text-muted)"} strokeWidth={1} onClick={() => setEditorState({...editorState, zoom_level: editorState.zoom_level < 2.5 ? editorState.zoom_level + 0.1 : 2.5 })}/>

                            <p className="font-normal text-textMuted text-xs">{Math.round(editorState.zoom_level * 100)}%</p>

                            <Minus size={18} color={"var(--text-muted)"} strokeWidth={1} onClick={() => setEditorState({...editorState, zoom_level: editorState.zoom_level > 0.5 ? editorState.zoom_level - 0.1 : 0.5 })} />
                        </div>

                        <div className="w-96 justify-center flex flex-row items-center gap-2 select-none" style={{ justifyContent: "flex-end" }}>
                            { bookState?.type == "book" ? <p className="font-normal text-textMuted text-xs"><b className="font-bold">{editorState.chapters}</b> {editorState.chapters > 1 ? "Chapters" : "Chapter"}</p> : <></> }
                            <p className="font-normal text-textMuted text-xs"><b className="font-bold">{editorState.words}</b> Words</p>
                            <p className="font-normal text-textMuted text-xs"><b className="font-bold">{editorState.chars}</b> Characters</p>
                        </div>
                    </div>
                    
                    <div className="h-full w-full overflow-auto p-8 flex items-center flex-col gap-4 relative select-none" id={"EditorDocument"} style={{ zoom: `${editorState.zoom_level * 100}%` }}>
                        {  
                            editor?.type == "book" && editor?.active_sub_file
                            ?
                            editor?.children?.map((chapter: File, index: number) => {
                                return <BookChapter key={`Chapter${index}BOOK-CHAPTER`} chapter={index} content={chapter} domWidth={`${bookState?.settings?.view_mode == 'wide' ? '60%' : bookState?.settings?.view_mode == 'full' ? '100%' : '480px'}`} />
                            })
                            :
                            //@ts-expect-error
                            !editor?.is_folder ? <BookDocument content={editor} domWidth={`${bookState?.settings?.view_mode == 'wide' ? '60%' : bookState?.settings?.view_mode == 'full' ? '100%' : '480px'}`} /> : <></>
                        }
                    </div>
                </div>
            </div>
        </BookContext.Provider>
    )
}

export default Book;