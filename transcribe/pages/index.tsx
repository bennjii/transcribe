
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
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
}
