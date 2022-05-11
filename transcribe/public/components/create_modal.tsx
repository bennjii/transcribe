import styles from '@styles/Home.module.css'
import { SupabaseClient } from '@supabase/supabase-js'
import { createContext, useEffect, useState } from 'react'
import Button from '@components/button'

import Head from 'next/head'
import { Bookmark, Home, List, LogOut, Rss } from 'react-feather'
import { skipPartiallyEmittedExpressions } from 'typescript'
import Header from './header'
import ProjectCard from './project_card'
import UserComponent from './user_component'
import NavItem from './nav_item'
import HomeContext from '@public/@types/home_context'
import Viewer from './view_viewer'
import { Input, Modal, Text } from '@geist-ui/react'
import { supabase } from '@root/client'
import { newBook } from '@public/@types/project'
import router from 'next/router'

const CreateModal: React.FC<{ modal: any }> = ({ modal }) => {
    const { visible, setVisible, bindings } = modal;
    const [ setting, setSetting ] = useState({
        name: "",
        description: ""
    });
    const [ creating, setCreating ] = useState(false);

    return (
        <Modal className={styles.createProjectPage} visible={visible} {...bindings} style={{ borderRadius: 0 }} disableBackdropClick={creating}>
            <Modal.Title>Create</Modal.Title>
            <Text p style={{ marginTop: 0 }}>Create a new book, project, idea</Text>

            <Modal.Content className="flex flex-col gap-10">
                <Input placeholder="Project name" width="100%" onChange={(e) => setSetting({ ...setting, name: e.target.value })} style={{ height: '100px' }}>Project Name</Input>
                <Input placeholder="Description" width="100%" onChange={(e) => setSetting({ ...setting, description: e.target.value })} style={{ height: '100px' }}>Description</Input>
            </Modal.Content>

            <Modal.Action passive onClick={() => setVisible(false)}>
                Cancel
            </Modal.Action>
            <Modal.Action loading={creating} disabled={setting.name == "" || creating} onClick={() => {
                const book = newBook(setting.name);
                setCreating(true);

                supabase
                    .from('projects')
                    .insert({
                        owner: supabase.auth.user().id,
                        name: setting.name,
                        file_structure: {
                            id: 1,
                            name: setting.name,
                            children: [book],
                            type: "folder",
                            is_folder: true,
                            settings: {
                                share: false,
                                permType: "private"
                            }
                        },
                        active_file: book.id,
                        settings: {
                            publisher: "transcribe",
                            description: setting.description
                        }
                    }).then(e => {
                        if(e.data) {
                            router.push(`/editor/${e.data[0].id}`)
                            setCreating(false);
                        }
                    })
            }}>
                Create
            </Modal.Action>
        </Modal>   
    )
}

export { CreateModal }