import ProjectContext from "@public/@types/project_context";
import { useContext, useEffect, useRef, useState } from "react";
import { ArrowRight, Bold, Book, Clipboard, File as FileIcon, FileText, Italic, Underline } from "react-feather";

import { CssBaseline, Divider, Grid, Input, Modal, Radio, Text, useModal, Checkbox, Note, Snippet, Button } from "@geist-ui/react";
import styles from '@styles/Home.module.css'

import { File, Folder, Project } from '@public/@types/project'
import { create } from "domain";
import { supabase } from "@root/client";

import { v4 as uuidv4 } from 'uuid'
import Delta from "quill-delta";

const FolderPrefrenceModal: React.FC<{ modal: any, data: any }> = ({ modal, data }) => {
    const { prefrencesVisible: visible, setPrefrencesVisible: setVisible, prefrenceBindings: bindings } = modal;
    const { project, projectCallback, editor, editorCallback, synced } = useContext(ProjectContext);

    const [ settings, setSettings ] = useState(data?.settings);
    const [ utilName, setUtilName ] = useState(data?.name);

    const [ creating, setCreating ] = useState(false);
    const [ unableToDelete, setUnableToDelete ] = useState(true);

    useEffect(() => {
        if(creating && synced) { setVisible(false); setCreating(false); }
    }, [synced])

    useEffect(() => {
        setSettings(data?.settings);
        setUtilName(data?.name);
        setCreating(false);
    }, [data])

    const saveSettings = () => {
        setCreating(true);
        if(utilName && utilName !== data.name) data.name = utilName;
        if(settings && JSON.stringify(settings) !== JSON.stringify(data.settings)) data.settings = settings;

        projectCallback({
            ...project,
            file_structure: { ...project.file_structure }
        });
    }

    return (
        <Modal visible={visible} {...bindings} style={{ borderRadius: 0 }}  onClose={() => { setUnableToDelete(true); setVisible(false) }}>
            <Modal.Title>'{data?.name}' Prefrences</Modal.Title>
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
                        <Radio.Group                         
                            value={settings?.permType ? settings?.permType : "private"}
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
                            {`${process.browser ? window?.location?.host : ""}/share/${project.id}/${data.id}`}
                        </Snippet>
                    </>
                    :
                    <></>
                }

                <Divider align="start">delete</Divider>

                <Text style={{ fontSize: 'calc(calc(1 * 16px) * 0.85)', color: '#999', margin: 0 }} p>Delete the document or book to remove it from the file view, once removed cannot be restored.</Text>
                <Note label={false} type="error" filled>Once deleted, a document cannot be restored.</Note>

                <Input type="default" clearable placeholder={`Enter ${data.type} name`} width="100%" onChange={(e) => {
                    if(e.target.value == data.name) setUnableToDelete(false);
                    else setUnableToDelete(true);
                }} />
                <Button ghost disabled={unableToDelete} type="error" iconRight={<ArrowRight />} onClick={() => {
                    setCreating(true);

                    console.log(`Deleting ${data.id} from ${project.name}`);
                    let parent;

                    // Reccursive Find.
                    const reccursion = (element: Folder) => {
                        return element?.children?.forEach(_element => {
                            if(_element.id == data.id) { 
                                parent = element;
                                return true;
                            }else return _element.is_folder ? reccursion( _element) : null;
                        });
                    }

                    reccursion(project.file_structure);
                    
                    parent.children = parent.children.filter(e => e.id !== data.id);
                    console.log(project);

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
            <Modal.Action loading={creating} onClick={() => saveSettings()}>
                Save
            </Modal.Action>
        </Modal>
    )
}

export default FolderPrefrenceModal;