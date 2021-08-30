import ProjectContext from "@public/@types/project_context";
import { useContext, useEffect, useRef, useState } from "react";
import { Bold, Book, Clipboard, File as FileIcon, FileText, Italic, Underline } from "react-feather";

import { CssBaseline, Divider, Grid, Input, Modal, Radio, Text, useModal, Checkbox, Note, Snippet } from "@geist-ui/react";
import styles from '@styles/Home.module.css'

import { File, Folder, Project } from '@public/@types/project'
import { create } from "domain";
import { supabase } from "@root/client";

import { v4 as uuidv4 } from 'uuid'
import Delta from "quill-delta";

const PrefrenceModal: React.FC<{ modal: any }> = ({ modal }) => {
    const { prefrencesVisible: visible, setPrefrencesVisible: setVisible, prefrenceBindings: bindings } = modal;
    const { project, projectCallback, editor, editorCallback, synced } = useContext(ProjectContext);

    const [ settings, setSettings ] = useState(editor?.settings);
    const [ utilName, setUtilName ] = useState(editor?.name);

    const [ creating, setCreating ] = useState(false);

    useEffect(() => {
        if(creating && synced) { 
            setVisible(false); 
            setCreating(false);
        }
    }, [synced])

    useEffect(() => {
        setSettings(editor?.settings);
        setUtilName(editor?.name);
        setCreating(false);
    }, [editor])

    const saveSettings = () => {
        setCreating(true);
        if(utilName && utilName !== editor.name) editor.name = utilName;
        if(settings && JSON.stringify(settings) !== JSON.stringify(editor.settings)) editor.settings = settings;

        projectCallback({
            ...project,
            file_structure: { ...project.file_structure }
        });
    }

    return (
        <Modal visible={visible} {...bindings} style={{ borderRadius: 0 }}>
            <Modal.Title>'{editor?.name}' Prefrences</Modal.Title>
            <Text p style={{ marginTop: 0 }}>Apply settings & prefrences</Text>

            <Modal.Content className={styles.exportModalContent}>
                <Divider align="start">details</Divider>
                <Input label="Name" placeholder="New Item" initialValue={utilName} width={"100%"} onChange={(e) => {
                    setUtilName(e.target.value);
                }}/>

                <Divider align="start">share</Divider>

                <div className={styles.checkboxElement} >
                    <Checkbox initialChecked={settings?.share} onChange={(e) => setSettings({...settings, share:e.target.checked}) }>Enable Sharing</Checkbox> 
                    <Text style={{ fontSize: 'calc(calc(1 * 16px) * 0.85)', color: '#999', margin: 0 }} p>Allows others to view, edit and comment on their own copies of the document</Text>
                </div>
                
                {
                    settings?.share ? 
                    <>
                        <Divider align="start">permissions</Divider>

                        <Radio.Group                         
                            value={settings?.permType ? settings?.permType : "private"}
                            //@ts-expect-error 
                            onChange={(e) => setSettings({...settings, permType: e.toString()})} 
                            useRow
                        >
                            <Grid.Container gap={2} justify="center">
                                <Grid xs={12}>
                                    <Radio value="public" defaultChecked>
                                        Public
                                        <Radio.Desc>Anyone With Link Can View</Radio.Desc>
                                    </Radio>
                                </Grid>
                                
                                <Grid xs={12}>
                                    <Radio value="private">
                                        Private
                                        <Radio.Desc>Only Allowed Accounts Can View</Radio.Desc>
                                    </Radio>
                                </Grid>
                            </Grid.Container>
                        </Radio.Group>

                        <Text style={{ fontSize: 'calc(calc(1 * 16px) * 0.85)', color: '#999', margin: 0 }} p>Share URL, send this to your editors</Text>
                        <Snippet width="100%" className={styles.snippet} style={{ fontSize: '.8rem' }} symbol="">
                            {`${process.browser ? window?.location?.host : ""}/share/${project.id}/${editor.id}`}
                        </Snippet>
                    </>
                    :
                    <></>
                }

                {/* {
                    (JSON.stringify(editor?.settings) !== JSON.stringify(settings)) || editor.name !== utilName ? 
                    <div className={styles.unSavedChanges}>
                        unsaved changes
                    </div>
                    :
                    <></>
                } */}

            </Modal.Content>
            <Modal.Action passive onClick={() => setVisible(false)}>
                Cancel
            </Modal.Action>
            <Modal.Action disabled={!((JSON.stringify(editor?.settings) !== JSON.stringify(settings)) || editor.name !== utilName)} loading={creating} onClick={() => saveSettings()}>
                Save
            </Modal.Action>
        </Modal>
    )
}

export default PrefrenceModal;