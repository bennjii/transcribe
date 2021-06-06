
import Head from 'next/head'
import { ArrowRight, Book, ChevronDown, FileText } from 'react-feather'
import BookInput from '../public/components/book_input';
import styles from '../styles/Home.module.css'

export default function Home() {
	// Import this from a databse later - just for proof of concept.
	const book = {
		name: 'Wintersteel',
		cover: 'http://...',
		chapters: [
			{
				title: 'Chapter 1',
				format: {
					fontFamily: 'Bodoni Moda',
					fontSize: '1.2rem'
				},
				content: {
					text: 'The Fallen Leaf School had several methods of contacting the other schools, and some of the Akura Golda had techniques or constructs intended to spy on far-off locations. They were often slow or blurry because of the suppresion field, but they all indicated the same thing: the Golden Sword School had left days ago, if no weeks.',
					format: {
						fontFamily: 'PT Serif',
						fontSize: '1rem',
						color: '#55595e',
						marginBottom: '5px',
						marginTop: '0px'
					}
				}
			}
		]
	};

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
							<p>Wintersteel</p>
							{/* <ChevronDown size={18}/> */}
						</div>

						<div className={styles.openFolder}>
							<Book size={18} color={"#597298"}/>
							<p>Publication</p>
						</div>

						<div>
							<FileText size={18} color={"#929296"}/>
							<p>Planning</p>
						</div>

						<div>
							<FileText size={18} color={"#929296"}/>
							<p>Story Overview</p>
						</div>
					</div>
					
				</div>
				

				<div className={styles.toolbar}>
					<div>
						<p>Ben White</p>
					</div>
				</div>
				
			</div>

			<div className={styles.editorContent}>
				{/* Content... */}

				<div className={styles.book}>
					<div>
						<h2 
						contentEditable
						style={{
							...book.chapters[0].format
						}}>{book.chapters[0].title}</h2>

						<BookInput value={book.chapters[0]} />
					</div>
				</div>

				<div className={styles.bookTools}>
					helper
				</div>
			</div>
		</div>
	)
}
