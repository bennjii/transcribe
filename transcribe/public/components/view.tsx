import styles from '@styles/Home.module.css'
import { SupabaseClient } from '@supabase/supabase-js'
import { createContext, useEffect, useState } from 'react'
import Button from '@components/button'

import Head from 'next/head'
import { LogOut } from 'react-feather'
import { skipPartiallyEmittedExpressions } from 'typescript'
import Header from './header'
import ProjectCard from './project_card'
import UserComponent from './user_component'

const View: React.FC<{ client: SupabaseClient }> = ({ client }) => {
    const [ data, setData ] = useState(null);
    
    useEffect(() => {
        const userListener = client
            .from(`users:id=eq.${client.auth.user().id}`) // :id=eq.${client.auth.user().id}
            .on('*', (payload) => {
                setData({ ...payload.new }) 
            })
            .subscribe()

        return () => {
            userListener.unsubscribe()
        }
    }, [])

    useEffect(() => {
        client
            .from('users')
            .select(`
                id,
                username,
                creation_date,
                projects:projects ( name, id, owner, creation_date, last_edited )
            `)
            .eq('id', client.auth.user().id)
            .then(e => {
                console.log(e);
                if(!e.error) setData(e.data[0]);
            });
    }, [])
    
    if(data)
        return (
            <div className={styles.container}>
                <Head>
                    <title>transcribe</title>
                    <meta name="viewport" content="maximum-scale=1.5, initial-scale: 1.5, width=device-width" />
                </Head>
                
                <div className={styles.header}>
                    <Header />

                    <div className={styles.headerIntermediary}>

                    </div>

                    <UserComponent user={data}/>
                </div>

                <div className={styles.projectView}>
                    <h1>Your Projects</h1>

                    <div>
                        {
                            data?.projects?.map(e => {
                                return <ProjectCard content={e} key={`Card-${e.name}`}/>
                            })
                        }
                    </div>
                </div>
            </div>        
        )
    else 
        return (
            <div>
                <p><i>transcribe</i></p>
            </div>
        )
}

export { View }