import ProjectContext from "@public/@types/project_context";
import { useContext, useEffect, useRef, useState } from "react";
import { ArrowRight, Bold, Book, Clipboard, File as FileIcon, FileText, Italic, Underline } from "react-feather";

import { CssBaseline, Divider, Grid, Input, Modal, Radio, Text, useModal, Checkbox, Note, Snippet, Button, Collapse } from "@geist-ui/react";
import styles from '@styles/Home.module.css'

import { Folder } from '@public/@types/project'

const VisualPreferenceModal: React.FC<{ modal: any, data?: any }> = ({ modal, data }) => {
    const { vpVisible: visible, setVPVisible: setVisible, vpBindings: bindings } = modal;
    const { project, projectCallback, editors, editorsCallback, synced } = useContext(ProjectContext);

    const ed = editors.findIndex(e => e.id == data?.id);
    const editor = editors[ed];

    const [ settings, setSettings ] = useState(editor?.settings);
    const [ utilName, setUtilName ] = useState(editor?.name);
    const [ creating, setCreating ] = useState(false);

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
    };

    return (
        <Modal visible={visible} {...bindings} style={{ borderRadius: 0 }} onClose={() => { setVisible(false) }}>
            <Modal.Title>Visual preferences</Modal.Title>
            <Text p style={{ marginTop: 0 }}>Change the visual appearance</Text>

            <Modal.Content className={styles.exportModalContent}>
                <Divider align="start">theme</Divider>

                <div className={styles.checkboxElement}>
                    <Radio.Group onChange={(e) => setSettings({...settings, theme: e as "light" | "dark"})} value={settings?.theme}>
                        <Radio value="light">
                            Light
                            <Radio.Desc>White background with black text.</Radio.Desc>    
                        </Radio>
                        <Radio value="dark">
                            Dark
                            <Radio.Desc>Black background with white text.</Radio.Desc>      
                        </Radio>
                    </Radio.Group>
                </div>   

                <Divider align="start">view width</Divider>
                <div className={styles.checkboxElement} >
                    <Radio.Group onChange={(e) => setSettings({...settings, view_mode: e as "normal" | "wide" | "full"})} value={settings?.view_mode}>
                        <Radio value="normal">Normal<Radio.Desc>Default Size</Radio.Desc></Radio>
                        <Radio value="wide">Wide<Radio.Desc>More Horisonal Editing</Radio.Desc></Radio>
                        <Radio value="full">Full<Radio.Desc>Maximum Horisontal Editing</Radio.Desc></Radio>
                    </Radio.Group>
                </div>
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

export default VisualPreferenceModal;