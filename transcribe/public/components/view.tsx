import styles from '@styles/Home.module.css'
import { SupabaseClient } from '@supabase/supabase-js'
import { createContext, useEffect, useState } from 'react'
import Button from '@components/button'

import Head from 'next/head'
import { Bookmark, Home, List, LogOut, Rss } from 'react-feather'
import Header from './header'
import ProjectCard from './project_card'
import UserComponent from './user_component'
import NavItem from './nav_item'
import HomeContext from '@public/@types/home_context'
import Viewer from './view_viewer'

const View: React.FC<{ client: SupabaseClient }> = ({ client }) => {
    const [ data, setData ] = useState(null);
    const [ activePage, setActivePage ] = useState('projects-page');

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
                if(!e.error) setData(e.data[0]);
            });
    }, [])
    
    if(data)
        return (
            <HomeContext.Provider value={{ page: activePage, pageCallback: setActivePage, info: data, __infoCallback: setData }}>
                <div className="flex h-screen overflow-hidden sm:flex-row flex-col">
                    <Head>
                        <title>transcribe</title>
                        <meta name="viewport" content="maximum-scale=1.5, initial-scale: 1.5, width=device-width" />
                    </Head>
                    
                    <div className="bg-[#fff] justify-between sm:justify-start sm:w-20 md:w-64 lg:w-80 font-normal text-lg flex flex-row sm:flex-col w-full sm:h-full border-r-borderDefault dark:border-r-borderDefaultDark border-r-[1px] dark:bg-bgDarkDark" style={{ fontFamily: "PT Serif" }}>
                        <Header />

                        <div className="flex flex-row-reverse sm:flex-col justify-start sm:p-4 p-2 gap-2 flex-1 bg-[rgba(156, 143, 188, 0.055)] font-psans dark:bg-bgDark w-full m-0">
                            <NavItem name={"Projects"} link={"projects-page"} icon={<List size={18} />}/>

                            <NavItem name={"Resources"} link={"resources-page"} icon={<Bookmark size={18} />}/>

                            <NavItem name={"Releases"} link={"releases-page"} icon={<Rss size={18} /> }/>
                        </div>

                        <UserComponent user={data}/>
                    </div>

                    <Viewer />
                </div>   
            </HomeContext.Provider>     
        )
    else 
        return (
            <div className={styles.centerLoader}>
                <p><i>transcribe</i></p>
            </div>
        )
}

export { View }