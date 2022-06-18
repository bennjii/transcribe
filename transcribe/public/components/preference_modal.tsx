import ProjectContext from "@public/@types/project_context";
import { useContext, useEffect, useRef, useState } from "react";
import { ArrowRight, Bold, Book, Clipboard, File as FileIcon, FileText, Italic, Underline } from "react-feather";

import { CssBaseline, Divider, Grid, Input, Modal, Radio, Text, useModal, Checkbox, Note, Snippet, Button, Collapse } from "@geist-ui/react";
import styles from '@styles/Home.module.css'

import { File, Folder, Project } from '@public/@types/project'
import { create } from "domain";
import { supabase } from "@root/client";

import { v4 as uuidv4 } from 'uuid'
import Delta from "quill-delta";

const PreferenceModal: React.FC<{ modal: any, data?: any }> = ({ modal, data }) => {
    const { preferencesVisible: visible, setPreferencesVisible: setVisible, preferenceBindings: bindings } = modal;
    const { project, projectCallback, editors, editorsCallback, synced } = useContext(ProjectContext);
    const [ bookState, setBookState ] = useState<Folder>(null);

    const ed = editors.findIndex(e => e?.id == data?.id);
    const editor = editors[ed];

    const [ settings, setSettings ] = useState(editor?.settings);
    const [ utilName, setUtilName ] = useState(editor?.name);

    const [ creating, setCreating ] = useState(false);
    const [ unableToDelete, setUnableToDelete ] = useState(true);

    useEffect(() => {
        if(creating && synced) { setVisible(false); setCreating(false); }
    }, [synced])

    useEffect(() => {
        setSettings(editor?.settings);
        setUtilName(editor?.name);
        setCreating(false);
    }, [editor])

    const saveSettings = () => {
        setCreating(true);
        if(utilName && utilName !== editor?.name) editor.name = utilName;
        if(settings && JSON.stringify(settings) !== JSON.stringify(editor?.settings)) editor.settings = settings;

        projectCallback({
            ...project,
            file_structure: { ...project.file_structure }
        });
    }

    return (
        <Modal visible={visible} {...bindings} style={{ borderRadius: 0 }} onClose={() => { setUnableToDelete(true); setVisible(false) }}>
            <Modal.Title>'{editor?.name}' Preferences</Modal.Title>
            <Text p style={{ marginTop: 0 }}>Apply settings & preferences</Text>

            <Modal.Content className={styles.exportModalContent}>
                <Divider align="start">details</Divider>
                <Input label="Name" placeholder="New Item" initialValue={utilName} width={"100%"} onChange={(e) => {
                    setUtilName(e.target.value);
                }}/>

                {
                    editor?.type == "book" ? 
                    <div className={styles.checkboxElement} >
                        <Checkbox initialChecked={settings?.performance} onChange={(e) => setSettings({...settings, performance: e.target.checked}) }>Performance Mode</Checkbox> 
                        <Text style={{ fontSize: 'calc(calc(1 * 16px) * 0.85)', color: '#999', margin: 0 }} p>Enable performance mode if you are experiencing performance issues with editing</Text>
                    </div>
                    :
                    <></>
                }
               
                <Divider align="start">share</Divider>

                <div className={styles.checkboxElement} >
                    <Checkbox initialChecked={settings?.share} onChange={(e) => setSettings({...settings, share:e.target.checked}) }>Enable Sharing</Checkbox> 
                    <Text style={{ fontSize: 'calc(calc(1 * 16px) * 0.85)', color: '#999', margin: 0 }} p>Allows others to view, edit and comment on their own copies of the document</Text>
                </div>
                
                {
                    settings?.share ? 
                    <>
                        <Radio.Group                         
                            value={settings?.permType ? settings?.permType : "private"}
                            onChange={(e) => setSettings({...settings, permType: e.toString() as "public" | "private"})} 
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
                            {`${process.browser ? window?.location?.host : ""}/share/${project.id}/${editor?.id}`}
                        </Snippet>
                    </>
                    :
                    <></>
                }
{/* 
                <Collapse title={null} subtitle={<Divider align="start">delete</Divider>}>
                    <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
                </Collapse> */}

                <Divider align="start">delete</Divider>

                <Text style={{ fontSize: 'calc(calc(1 * 16px) * 0.85)', color: '#999', margin: 0 }} p>Delete the document or book to remove it from the file view, once removed cannot be restored.</Text>
                <Note label={false} type="error" style={{ opacity: 0.7 }} filled>Once deleted, a document cannot be restored.</Note>
                
                <Input type="default" clearable placeholder={`Enter ${editor?.type?.replace("_", " ").replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))} Name`} width="100%" onChange={(e) => {
                    if(e.target.value == editor?.name) setUnableToDelete(false);
                    else setUnableToDelete(true);
                }} />
                <Button ghost disabled={unableToDelete} type="error" iconRight={<ArrowRight />} onClick={() => {
                    setCreating(true);

                    console.log(`Deleting ${editor?.id} from ${project.name}`);
                    let parent;

                    // Reccursive Find.
                    const reccursion = (element: Folder) => {
                        return element?.children?.forEach(_element => {
                            if(_element.id == editor?.id) { 
                                parent = element;
                                return true;
                            }else return _element.is_folder ? reccursion( _element) : null;
                        });
                    }

                    reccursion(project.file_structure);
                    
                    parent.children = parent.children.filter(e => e.id !== editor?.id);

                    if(parent.children.filter(e => e.type !== "folder").length > 0) { 
                        editorCallback(parent.children[0]); 
                        project.active_file = parent.children[0].id; 
                        setVisible(false) 
                    }else { 
                        editorCallback(project.file_structure.children[0]); 
                        project.active_file = project.file_structure.children[0].id; 
                        setVisible(false) 
                    }

                    projectCallback(JSON.parse(JSON.stringify(project)));
                }}>Delete</Button>

            </Modal.Content>
            <Modal.Action passive onClick={() => setVisible(false)}>
                Cancel
            </Modal.Action>
            <Modal.Action disabled={!((JSON.stringify(editor?.settings) !== JSON.stringify(settings)) || editor?.name !== utilName)} loading={creating} onClick={() => saveSettings()}>
                Save
            </Modal.Action>
        </Modal>
    )
}

export default PreferenceModal;