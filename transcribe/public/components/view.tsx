import styles from '@styles/Home.module.css'
import { SupabaseClient } from '@supabase/supabase-js'
import { createContext, useEffect, useState } from 'react'

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
                // setData(e.data[0]); // I mean they should be the first user right????
            });
    }, [])
    
    if(data)
        return (
            <div className={styles.container}>
                <Head>
                    <title>Wintersteel</title>
                    <meta name="viewport" content="maximum-scale=1.5, initial-scale: 1.5, width=device-width" />
                </Head>
                
                <div className={styles.header}>
                    {/* Header */}
                    <div className={styles.logo}>
                        <p>transcribe</p>
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