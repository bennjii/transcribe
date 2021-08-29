import ProjectContext from "@public/@types/project_context";
import { useContext, useEffect, useRef, useState } from "react";
import { Bold, Book, Clipboard, File as FileIcon, FileText, Italic, Underline } from "react-feather";

import { CssBaseline, Divider, Grid, Input, Modal, Radio, Text, useModal } from "@geist-ui/react";
import styles from '@styles/Home.module.css'

import { File, Folder, Project } from '@public/@types/project'
import { create } from "domain";
import { supabase } from "@root/client";

import { v4 as uuidv4 } from 'uuid'
import Delta from "quill-delta";

const ExportModal: React.FC<{ modal: any }> = ({ modal }) => {
    const { exportVisible: visible, setExportVisible: setVisible, exportBindings: bindings } = modal;
    const { project, projectCallback, editor, editorCallback, synced } = useContext(ProjectContext);

    const [ type, setType ] = useState("file");
    const [ docType, setDocType ] = useState<"document" | "vision_board">("document");
    const [ utilName, setUtilName ] = useState(null);

    const [ creating, setCreating ] = useState(false);

    useEffect(() => {
        if(creating && synced) setVisible(false); 
    }, [synced])

    const exportBook = () => {
        
    }

    return (
        <Modal visible={visible} {...bindings} style={{ borderRadius: 0 }}>
            <div className={styles.printModal} id="print">
                <div>
                    {/* Layout Types */}
                    
                </div>
            </div>

            <Modal.Title>Export  '{editor?.name}'</Modal.Title>
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
            <Modal.Action loading={false} onClick={() => exportBook()}>
                Export
            </Modal.Action>
        </Modal>
    )
}

export default ExportModal;