import ProjectContext from "@public/@types/project_context";
import { useContext, useEffect, useRef, useState } from "react";
import { Bold, Book, Clipboard, File as FileIcon, FileText, Italic, Underline } from "react-feather";

import { CssBaseline, Divider, Grid, Input, Modal, Radio, Text, useModal } from "@geist-ui/react";
import styles from '@styles/Home.module.css'

import { File, Folder, newFile, newFolder, Project } from '@public/@types/project'
import { create } from "domain";
import { supabase } from "@root/client";

import { v4 as uuidv4 } from 'uuid'
import Delta from "quill-delta";

const NewFileModal: React.FC<{ modal: any }> = ({ modal }) => {
    const { visible, setVisible, bindings } = modal;
    const { project, projectCallback, editor, editorCallback, synced } = useContext(ProjectContext);

    const [ type, setType ] = useState("file");
    const [ docType, setDocType ] = useState<"document" | "vision_board">("document");
    const [ utilName, setUtilName ] = useState(null);

    const [ creating, setCreating ] = useState(false);

    useEffect(() => {
        if(creating && synced) setVisible(false); 
    }, [synced])

    const create = () => {
        if(type == "folder") {
            setCreating(true);
            console.log(`Creating new ${type} with name ${utilName}`);

            projectCallback({
                ...project,
                file_structure: {
                    ...project.file_structure,
                    children: [
                        ...project.file_structure.children,
                        newFolder(utilName)
                    ]
                }
            });

        }else if(type == "file") {
            setCreating(true);
            console.log(`Creating new ${type} (${docType}) with name ${utilName}`);

            projectCallback({
                ...project,
                file_structure: {
                    ...project.file_structure,
                    children: [
                        ...project.file_structure.children,
                        newFile(utilName, docType)
                    ]
                }
            });
        }else {
            console.error(`An error occured creating ${type} with name ${utilName}`);
        }
    }

    return (
        <Modal visible={visible} {...bindings} style={{ borderRadius: 0 }}>
            <div className={styles.printModal} id="print">
                <div>
                    {/* Layout Types */}
                    
                </div>
            </div>

            <Modal.Title>Create</Modal.Title>
            <Text p style={{ marginTop: 0 }}>Create a new file, folder or book.</Text>

            <Modal.Content className={styles.exportModalContent}>
                <Divider align="start">type</Divider>
                <Radio.Group value="file" useRow onChange={(e) => setType(e.toString())}>
                    <Grid.Container gap={2} justify="center">
                        <Grid xs={12}>
                            <Radio value="file" style={{ color: '#597298 !important' }}>
                                File
                                <Radio.Desc>Editable Workspace</Radio.Desc>
                            </Radio>
                        </Grid>
                        
                        <Grid xs={12}>
                            <Radio value="folder">
                                Folder
                                <Radio.Desc>A Folder for Files</Radio.Desc>
                            </Radio>
                        </Grid>
                    </Grid.Container>
                </Radio.Group>

                <Divider align="start">details</Divider>
                <Input label="Name" placeholder="New Item" width={"100%"} onChange={(e) => {
                    setUtilName(e.target.value);
                }}/>

                {
                    type == "file" ? (
                        <>
                            <Divider align="start">type</Divider>
                            <Radio.Group value="document" useRow onChange={(e) => 
                                //@ts-expect-error
                                setDocType(e.toString())
                            }>
                                <Grid.Container gap={2} justify="center">
                                    <Grid xs={12}>
                                        <Radio value="document" defaultChecked>
                                            Document
                                            <Radio.Desc>Editable Document</Radio.Desc>
                                        </Radio>
                                    </Grid>
                                    
                                    <Grid xs={12}>
                                        <Radio value="vision_board">
                                            Vision Board
                                            <Radio.Desc>Open Vision Space</Radio.Desc>
                                        </Radio>
                                    </Grid>
                                </Grid.Container>
                            </Radio.Group>
                        </>
                    ) : <></>
                }

            </Modal.Content>
            <Modal.Action passive onClick={() => setVisible(false)}>
                Cancel
            </Modal.Action>
            <Modal.Action loading={creating} onClick={() => {
                create()
            }}>
                Create
            </Modal.Action>
        </Modal>
    )
}

export default NewFileModal;