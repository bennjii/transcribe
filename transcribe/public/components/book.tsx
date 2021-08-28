import { memo, TextareaHTMLAttributes, useEffect, useRef, useState } from "react";
import { Bold, ChevronDown, Italic, Minus, Plus, Underline, Book as BookIcon, Share, Download, Menu, BookOpen } from "react-feather";

import styles from '../../styles/Home.module.css'
import { Book as BookType } from "../@types/book";
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';

import BookContext from "../@types/book_context";
import BookChapter from "./book_chapter";
import { useContext } from "react";
import ProjectContext from "@public/@types/project_context";
import Editor from "./editor";
import { File, Folder, Project } from "@public/@types/project";
import ReactQuill, { Quill } from "react-quill";

import Delta from 'quill-delta'
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import jsPDF from "jspdf";
import { CssBaseline, Divider, Grid, Modal, Radio, Text, useModal } from "@geist-ui/react";

const Book: React.FC<{}> = ({ }) => {
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

    const { visible, setVisible, bindings } = useModal();

    return (
        <BookContext.Provider value={{ book: bookState, callback: setBookState }}>
            <div className={styles.editorContent}>
                {/* Content... */}

                <Modal visible={visible} {...bindings} style={{ borderRadius: 0 }}>
                    <div className={styles.printModal} id="print">
                        <div>
                            {/* Layout Types */}
                            
                        </div>
                    </div>

                    <Modal.Title>Export  '{bookState?.name}'</Modal.Title>
                    <Text p style={{ marginTop: 0 }}>Choose how to generate and export your book.</Text>

                    <Modal.Content className={styles.exportModalContent}>
                        <Divider align="start">theme</Divider>
                        <Radio.Group value="theme-1" useRow>
                            <Grid.Container gap={2} justify="center">
                                <Grid xs={12}>
                                    <Radio value="theme-1" style={{ color: '#597298 !important' }}>
                                        Book 1
                                        <Radio.Desc>Old Theme</Radio.Desc>
                                    </Radio>
                                </Grid>
                                
                                <Grid xs={12}>
                                    <Radio value="theme-2">
                                        Book 2
                                        <Radio.Desc>Modern Theme</Radio.Desc>
                                    </Radio>
                                </Grid>
                            </Grid.Container>
                        </Radio.Group>

                        <Divider align="start">format</Divider>
                        <Radio.Group value="pdf" useRow>
                            <Grid.Container gap={2} justify="center">
                                <Grid xs={12}>
                                    <Radio value="pdf" defaultChecked>
                                        PDF
                                        <Radio.Desc>General Export</Radio.Desc>
                                    </Radio>
                                </Grid>
                                
                                <Grid xs={12}>
                                    <Radio value="html">
                                        HTML
                                        <Radio.Desc>Website Export</Radio.Desc>
                                    </Radio>
                                </Grid>

                                <Grid xs={12}>
                                    <Radio value="txt">
                                        TXT
                                        <Radio.Desc>Raw Text</Radio.Desc>
                                    </Radio>
                                </Grid>

                                <Grid xs={12}>
                                    <Radio value="ebook">
                                        EBook
                                        <Radio.Desc>Ebook Format</Radio.Desc>
                                    </Radio>
                                </Grid>
                            </Grid.Container>
                        </Radio.Group>
                    </Modal.Content>
                    <Modal.Action passive onClick={() => setVisible(false)}>
                        Cancel
                    </Modal.Action>
                    <Modal.Action loading={false}>
                        Export
                    </Modal.Action>
                </Modal>

                <div className={styles.book}>			
                    <div className={styles.bookCaptionBar}>
                        <div>
                            <BookIcon size={18} color={"var(--acent-text-color)"} />

                            <p>{editor?.name}</p>
                        </div>

                        <div className={styles.centerActions}>
                            {
                                bookState?.type == "book" ? 
                                <div className={styles.addChapter} onClick={() => {
                                    bookState?.children.push({
                                        name: "",
                                        is_folder: false,
                                        title_format: null,
                                        data: {},
                                        type: "document",
                                        id: uuidv4()
                                    })

                                    projectCallback({
                                        ...project
                                    })
                                }}>
                                    <Plus size={18} color={"var(--text-muted)"} strokeWidth={1.5}  />

                                    <p>Add Chapter</p>
                                </div>
                                :
                                <></>
                            }

                            <div className={styles.export} onClick={async () => {
                                setVisible(!visible)
                                console.log(bookState);

                                // // @ts-expect-error                                
                                // if(bookState?.children) {
                                //     const pdfExporter = require('quill-to-pdf').pdfExporter;
                                //     const doc = new jsPDF({
                                //         orientation: 'portrait',
                                //     });

                                //     const book = [];

                                //     //@ts-expect-error
                                //     bookState?.children.map((e, i) => {
                                //         book.push(...e.data.ops)
                                //     });

                                //     console.log(book);
                                    
                                //     const html = new QuillDeltaToHtmlConverter(book, {}).convert();
                                //     // const pdf = await pdfExporter.generatePdf(new Delta({ ops: book }));
                                //     // saveAs(pdf, `${bookState.name.replace(/\s/g, '_').toLowerCase()}.pdf`);

                                //     const book_elem = document.createElement("div")
                                //         book_elem.innerHTML = html;

                                //     console.log(book_elem);

                                //     doc.html(book_elem, {
                                //         callback: function (doc) {
                                //             doc.save(`${bookState.name.replace(/\s/g, '_').toLowerCase()}.pdf`);
                                //         },
                                //         margin: [1,1,1,1],
                                //         // fontFaces: [{
                                //         //     family: "Public Sans",
                                //         //     style: 'normal',
                                //         //     src: [{
                                //         //         url: "./public/fonts/Public_Sans/PublicSans-VariableFont_wght.ttf",
                                //         //         format: "truetype"
                                //         //     }]
                                //         // }],
                                //         filename: `${bookState.name.replace(/\s/g, '_').toLowerCase()}.pdf`,
                                //         x: 10,
                                //         y: 10
                                //     })

                                //     // doc.addFileToVFS("MyFont.ttf", );
                                //     // doc.addFont("public/fonts/Public_Sans/PublicSans-VariableFont_wght.ttf", "Public Sans", "normal");
                                //     console.log(html);
                                // }
                            }}>
                                <Download size={18} color={"var(--text-muted)"} strokeWidth={1.5} />

                                <p>Export</p>
                            </div>
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
                    
                    <div className={styles.pages} id={"EditorDocument"} style={{ zoom: `${editorState.zoom_level * 100}%` }}>
                        {  
                            editor?.type == "book" && editor?.active_sub_file
                            ?
                            editor?.children?.map((chapter: File, index: number) => {
                                return <BookChapter key={`Chapter${index}BOOK-CHAPTER`} chapter={index} content={chapter} />
                            })
                            :
                            //@ts-expect-error
                            !editor?.is_folder ? <Editor content={editor} /> : <></>
                        }
                    </div>
                </div>
            </div>
        </BookContext.Provider>
    )
}

export default Book;