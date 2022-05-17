
import styles from '@styles/Home.module.css'
import { supabase } from '../client'
import { useEffect, useLayoutEffect, useState } from 'react'

import { Auth } from '@components/auth'
import { View } from '@components/view'
import { useRouter } from 'next/router'

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
	}) // Fetch User preferences

	const router = useRouter();
	const [ user, setUser ] = useState(supabase.auth.user());

	useEffect(() => {
		if(session)
			fetcher('/api/getUser', session.access_token).then(e => {
				setUser(e);
			});
		
		const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            //@ts-expect-error
			if(router.query.redir && supabase.auth.user()) router.replace(router.query.redir)
			setUser(supabase.auth.user());

			fetch('/api/auth', {
				method: 'POST',
				headers: new Headers({ 'Content-Type': 'application/json' }),
				credentials: 'same-origin',
				body: JSON.stringify({ event, session }),
			});
		})

		return () => {
			authListener.unsubscribe()
		}
	}, []);

	useLayoutEffect(() => {
		if(window && user && window?.location.href.includes("/?u=")) {
			supabase.auth.signOut();
			setUser(null);
		}else if(user && window?.location.href.includes("/?u=")) {
			const id = window?.location.href.split("/?u=");
			window.location.href = "./editor/" + id[1];
		}
	}, [router.query])

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