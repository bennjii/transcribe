import styles from '@styles/Home.module.css'
import { SupabaseClient } from '@supabase/supabase-js'
import { createContext, useEffect, useState } from 'react'
import Button from '@components/button'

import Head from 'next/head'

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
            .select('*')
            .eq('id', client.auth.user().id)
            .then(e => {
                setData({ ...e.data[0] });
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
                    {/* Header */}
                    <div className={styles.logo}>
                        <p>transcribe</p>
                    </div>

                    <div>

                    </div>

                    <div>
                        <Button title="Logout" onClick={() => {
                            client.auth.signOut();
                        }}></Button>
                    </div>
                </div>

                <div className={styles.projectView}>
                    <h1>Your Projects</h1>

                    <div>
                        {
                            data?.projects?.map(e => {
                                return <div>{e.title}</div>
                            })
                        }
                    </div>
                </div>
            </div>        
        )
    else 
        return (
            <div>
                loading thingy
            </div>
        )
}

export { View }