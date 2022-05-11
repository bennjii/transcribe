import ProjectContext from "@public/@types/project_context";
import { useContext, useEffect, useRef, useState } from "react";
import { ArrowRight, Bold, Book, Clipboard, File as FileIcon, FileText, Italic, Underline } from "react-feather";

import { Button, CssBaseline, Divider, Grid, Input, Modal, Note, Radio, Text, useModal } from "@geist-ui/react";
import styles from '@styles/Home.module.css'

import { File, Folder, newFile, newFolder, Project } from '@public/@types/project'
import { create } from "domain";
import { supabase } from "@root/client";

import { v4 as uuidv4 } from 'uuid'
import Delta from "quill-delta";
import router from "next/router";

const ProjectModal: React.FC<{ modal: any }> = ({ modal }) => {
    const { projectVisible: visible, setProjectVisible: setVisible, projectBindings: bindings } = modal;
    const { project, projectCallback, editor, editorCallback, synced } = useContext(ProjectContext);

    const [ settings, setSettings ] = useState(project?.settings);
    const [ utilName, setUtilName ] = useState(project?.name);

    const [ creating, setCreating ] = useState(false);
    const [ unableToDelete, setUnableToDelete ] = useState(true);

    useEffect(() => {
        if(creating && synced) { setVisible(false); setCreating(false); }
    }, [synced])

    const saveSettings = () => {
        setCreating(true);

        if(utilName && utilName !== project.name) project.name = utilName;
        if(settings && JSON.stringify(settings) !== JSON.stringify(project.settings)) project.settings = settings;

        projectCallback({
            ...project,
            file_structure: { ...project.file_structure }
        });
    }

    return (
        <Modal visible={visible} {...bindings} style={{ borderRadius: 0 }}>
            <Modal.Title>{project?.name}</Modal.Title>
            <Text p style={{ marginTop: 0 }}>Edit settings for {project?.name}</Text>

            <Modal.Content className={styles.exportModalContent}>
                <Divider align="start">details</Divider>
                <Input label="Project Name" placeholder="Project Name" initialValue={utilName} width={"100%"} onChange={(e) => {
                    setUtilName(e.target.value);
                }}/>

                <Input label="Book Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" placeholder="Book Title" initialValue={settings?.book_title ?? ""} width={"100%"} onChange={(e) => {
                    setSettings({ ...settings, book_title: e.target.value });
                }}/>

                <Input label="Author Name" placeholder="A B Smith" initialValue={settings?.author ?? ""} width={"100%"} onChange={(e) => {
                    setSettings({ ...settings, author: e.target.value });
                }}/>

                <Input label="Description &nbsp;&nbsp;&nbsp;" placeholder="A book about..." initialValue={settings?.description ?? ""} width={"100%"} onChange={(e) => {
                    setSettings({ ...settings, description: e.target.value });
                }}/>

                <Input label="Publisher &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" placeholder="Book Publisher (optional)" initialValue={settings?.publisher ?? ""} width={"100%"} onChange={(e) => {
                    setSettings({ ...settings, publisher: e.target.value });
                }}/>

                <Divider align="start">delete</Divider>

                <Text style={{ fontSize: 'calc(calc(1 * 16px) * 0.85)', color: '#999', margin: 0 }} p>By performing this action, you will be purging transcribe of <Text i>{project.name}</Text>. This action is <Text b>irreversable</Text>. Please make sure you truely wish to delete this project</Text>
                <Note label={false} type="error" style={{ opacity: 0.7 }} filled>Once deleted, a project cannot be restored.</Note>

                <Input type="default" clearable placeholder={`Enter Project Name`} width="100%" onChange={(e) => {
                    if(e.target.value.trim() == editor.name.trim()) setUnableToDelete(false);
                    else setUnableToDelete(true);
                }} />
                <Button ghost disabled={unableToDelete} type="error" iconRight={<ArrowRight />} onClick={() => {
                    setCreating(true);

                    supabase
                        .from('projects')
                        .delete()
                        .match({ id: project.id })
                        .then(e => {
                            router.push('../../');
                            setCreating(false);
                        });
                        
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

export default ProjectModal;