import ProjectContext from "@public/@types/project_context";
import { useContext, useEffect, useRef, useState } from "react";
import { Bold, Book, Clipboard, File as FileIcon, FileText, Italic, Underline } from "react-feather";

import { saveAs } from 'file-saver';
import { CssBaseline, Divider, Grid, Input, Modal, Radio, Text, useModal } from "@geist-ui/react";
import styles from '@styles/Home.module.css'

import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import Delta from "quill-delta";
import { Folder } from "@public/@types/project";

const ExportModal: React.FC<{ modal: any, id: string }> = ({ modal, id }) => {
    const { exportVisible: visible, setExportVisible: setVisible, exportBindings: bindings } = modal;
    const { project, projectCallback, editors, editorsCallback, synced } = useContext(ProjectContext);

    const [ theme, setTheme ] = useState<"normal" | "fancy">("normal");
    const [ exportFormat, setExportFormat ] = useState<"pdf" | "html" | "txt" | "ebook">("pdf");
    const [ creating, setCreating ] = useState(false);

    const [ bookState, setBookState ] = useState<Folder>(null);

    useEffect(() => {
        const ed = editors.findIndex(e => e.id == id);
        setBookState(editors[ed] as Folder);
    }, [editors]);

    let html2pdf;

    useEffect(() => {
        if(creating == false) setVisible(false);
    }, [creating])

    useEffect(() => {
        (async () => {
            const imp = await import('html-to-pdf-js');
            console.log(imp.default);
            html2pdf = imp.default;
        })();
    }, [])

    const exportBook = async () => {
        setCreating(true);

        switch(exportFormat) {
            case "pdf":
                const pdfExporter = require('quill-to-pdf').pdfExporter;

                if(bookState.is_folder) {
                    const book = [];
                    //@ts-expect-error
                    editor?.children.map((e, i) => { book.push(...e?.data?.ops) });

                    console.log(book);

                    const content = new QuillDeltaToHtmlConverter(book, {
                        encodeHtml: false
                    }).convert();

                    console.log(content);
                    let elem = document.createElement("div")
                    elem.innerHTML = content;

                    var opt = {
                        margin:       1,
                        filename:     'myfile.pdf',
                        image:        { type: 'jpeg', quality: 0.98 },
                        html2canvas:  { scale: 2 },
                        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
                    };

                    await html2pdf().set(opt).from(elem).save();

                    pdfExporter.generatePdf(content).then(e => {
                        saveAs(e, `${bookState.name.replace(/\s/g, '_').toLowerCase()}.pdf`);
                        setCreating(false);
                    })
                }else {
                    //@ts-expect-error
                    const document = editor?.data.ops;

                    pdfExporter.generatePdf(new Delta(document)).then(e => {
                        saveAs(e, `${bookState.name.replace(/\s/g, '_').toLowerCase()}.pdf`);
                        setCreating(false);
                    });
                }
                
                break;
            case "html":
                if(bookState.is_folder) {
                    const book = bookState?.children.map((e, i) => { 
                        const theme_delta = new Delta({
                            ops: [
                                //@ts-expect-error
                                ...e?.data?.ops.map(e => {
                                    return {
                                        ...e,
                                        attributes: {
                                            ...e?.attributes,
                                            font: e?.attributes?.font ? 
                                                e?.attributes?.font
                                                    .replace("-", " ")
                                                    .replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
                                            : "Times New Roman"
                                        }
                                    }
                                })
                            ]
                        });

                        return new Delta({ ops: [ 
                            {
                                insert: `\n\n${e?.name}`, 
                                attributes: { 
                                    color: "#202737",
                                    font: "Public Sans",
                                    size: "14px"
                                }   
                            },
                            {
                                insert: `\n`, 
                                attributes: { 
                                    color: "#202737",
                                    font: "Public Sans",
                                    header: 1
                                }   
                            }
                        ] }).concat(theme_delta).ops;
                    }).flat();

                    const title = new Delta({ 
                        ops: [ 
                            {
                                insert: `${bookState?.name}\n\n`, 
                                attributes: { 
                                    color: "#202737",
                                    font: "PT Serf",
                                    size: "30px"
                                }   
                            },
                            {
                                insert: `\n`, 
                                attributes: { 
                                    color: "#202737",
                                    font: "PT Serf",
                                    header: 1
                                }   
                            }
                        ]
                    });

                    const book_complete = title.concat(new Delta(book)).ops;
                    const html = new QuillDeltaToHtmlConverter(book_complete, {
                        encodeHtml: false,
                        inlineStyles: true,
                        allowBackgroundClasses: true
                    }).convert();

                    saveAs(new Blob([`<body>${html}</body>`], {type: "text/html;charset=utf-8"}), `${bookState.name.replace(/\s/g, '_').toLowerCase()}.html`);
                    setCreating(false);
                }else {
                    //@ts-expect-error
                    const document = new Delta({ ops: [ { insert: `${bookState.name}\n\n` } ] }).concat(new Delta(bookState?.data.ops));

                    const html = new QuillDeltaToHtmlConverter(document.ops, {
                        encodeHtml: false,
                        inlineStyles: {
                            font: {
                                'serif': "font-family: Public Sans, PT Serif, Times New Roman",
                                'monospace': 'font-family: Monaco, Courier New, monospace'
                            }
                        }
                    }).convert();

                    saveAs(new Blob([html], {type: "text/html;charset=utf-8"}), `${bookState.name.replace(/\s/g, '_').toLowerCase()}.html`);
                    setCreating(false);
                }

                break;
            case "txt":
                if(bookState.is_folder) {
                    const txt_raw = bookState?.children.map(e => {
                        //@ts-expect-error
                        // return e.data.ops.map(e => e.insert).join("");
                        return `\n\n${e.name}\n\n ${e.data.ops.map(e => e.insert).join("")}`
                    }).join("");

                    saveAs(new Blob([txt_raw], {type: "text/plain;charset=utf-8"}), `${bookState.name.replace(/\s/g, '_').toLowerCase()}.txt`);
                    setCreating(false);
                }else {
                    //@ts-expect-error
                    const txt_raw = `${editor.name}\n\n ${editor?.data?.ops?.map(e => e.insert).join("")}`;

                    saveAs(new Blob([txt_raw], {type: "text/plain;charset=utf-8"}), `${bookState.name.replace(/\s/g, '_').toLowerCase()}.txt`);
                    setCreating(false);
                }

                break;
            case "ebook":
                if(bookState.type == "book") {
                    const option = {
                        title: project.settings?.book_title ?? "Book", 
                        author: project.settings?.author ?? "Author",
                        publisher: project.settings?.publisher ?? "transcribe",
                        content: bookState.children.map(chapter => {
                            //@ts-expect-error
                            console.log(chapter?.data?.ops);
                            //@ts-expect-error
                            const html = new QuillDeltaToHtmlConverter(chapter?.data?.ops, {
                                encodeHtml: false
                            }).convert();

                            return {
                                title: chapter.name,
                                data: html
                            }
                        })
                    };

                    const data = await fetch(`../api/ebook`, {
                        method: "POST",
                        mode: 'same-origin',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(option)
                    }).then(res => {
                        return res.json();
                    })
                    
                    setCreating(false);
                }
                break;
            default:
                console.log("EXPORTING NULL");
                break;
        }
    }

    return (
        <Modal visible={visible} {...bindings} style={{ borderRadius: 0 }}>
            <div className={styles.printModal} id="print">
                <div>
                    {/* Layout Types */}
                    
                </div>
            </div>

            <Modal.Title>Export  '{bookState?.name}'</Modal.Title>
            <Text p style={{ marginTop: 0 }}>Choose how to generate and export your book.</Text>

            <Modal.Content className={styles.exportModalContent}>
                <Divider align="start">format</Divider>
                <Radio.Group value="pdf" useRow onChange={(e) => { 
                    //@ts-expect-error
                    setExportFormat(e.toString())}
                }>
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
                            <Radio value="ebook" disabled={bookState?.type !== "book"}>
                                EBook
                                <Radio.Desc>Ebook Format</Radio.Desc>
                            </Radio>
                        </Grid>
                    </Grid.Container>
                </Radio.Group>

                <>     
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
                </>

            </Modal.Content>
            <Modal.Action passive onClick={() => setVisible(false)}>
                Cancel
            </Modal.Action>
            <Modal.Action loading={creating} onClick={() => exportBook()}>
                Export
            </Modal.Action>
        </Modal>
    )
}

export default ExportModal;