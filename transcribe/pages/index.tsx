
import styles from '@styles/Home.module.css'
import { supabase } from '../client'
import { useEffect, useState } from 'react'

import { Auth } from '@components/auth'
import { View } from '@components/view'
import router from 'next/router'

const fetcher = (url, token) =>
  fetch(url, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
  }).then((res) => res.json())

const Index = () => {
	const session = supabase.auth.session()
	
	const [ cssProperties, setCssProperties ] = useState({
		"--color-primary": "var(--acent-bg-color)",
		"--color-primary-rgb": "89, 114, 152"
	}) // Fetch User prefernces

	const [ user, setUser ] = useState(supabase.auth.user());
	const [ authView, setAuthView ] = useState('sign_in')

	useEffect(() => {
		if(session)
			fetcher('/api/getUser', session.access_token).then(e => {
				setUser(e);
			});
		
		const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            //@ts-expect-error
			if(router.query.redir && supabase.auth.user()) router.replace(router.query.redir)
			setUser(supabase.auth.user());
		})
	}, []);

	if(!user) 
		return (
			//@ts-expect-error
			<div className={styles.stdPage} style={cssProperties}>
				<Auth client={supabase}/>
			</div>
		)
		
	else
		return (
			//@ts-expect-error
			<div className={styles.stdPage} style={cssProperties}>
				<View client={supabase}/>
			</div>
		)
}

export default Index