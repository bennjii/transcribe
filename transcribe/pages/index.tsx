
import Head from 'next/head'
import { ArrowRight, ChevronDown, FileText } from 'react-feather'
import styles from '../styles/Home.module.css'

export default function Home() {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				{/* Header */}
				<div className={styles.logo}>
					<p>transcribe</p>
				</div>

				<div className={styles.project}>
					<div>
						<h2>Wintersteel</h2>

						<ArrowRight size={18} strokeWidth={2}/>
					</div>
					

					<div className={styles.indentedFolder}>
						<div className={styles.folderHeader}>
							<p>project</p>
							<ChevronDown size={18}/>
						</div>

						<div>
							<FileText size={18} color={"#929296"}/>
							<p>Planning</p>
						</div>
					</div>
					
				</div>
				

				<div className={styles.toolbar}>
					<div>
						<p>Ben White</p>
					</div>
				</div>
				
			</div>

			<div>
				{/* Content... */}
			</div>
		</div>
	)
}
