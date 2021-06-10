
import Head from 'next/head'
import { ArrowRight, Book as BookIcon, ChevronDown, Circle, FileText, Settings } from 'react-feather'
// import { Chapter } from '../public/@types/book';
import Book from '../public/components/book';
import BookChapter from '../public/components/book_chapter';
import BookInput from '../public/components/book_input';
import { stringToJSON } from '../public/components/convert';
import styles from '../styles/Home.module.css'

export default function Home() {
	// Import this from a databse later - just for proof of concept.
    const local_book = process.browser ? JSON.parse(localStorage.getItem(`transcribe-editor_${'1'}`)) : null;
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
				// paragraphs...
				content: {
                    ops: [
                        {
                            insert: 'The Fallen Leaf School had several methods of contacting the other schools, and some of the Akura Golds had techniques or constructs intended to spy on far-off locations.'
                        }
                    ]
                }
			}
		]
	};

    console.log(local_book)

	return (
		<div className={styles.container}>
			<Head>
				<title>Wintersteel</title>
				<meta name="viewport" content="maximum-scale=1.5, initial-scale: 1.5, width=device-width" />
			</Head>
			
			<div className={styles.header}>
				{/* Header */}
				<div className={styles.logo}>
					<p>transcribe</p> <h4>beta</h4>
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
							<BookIcon size={18} color={"var(--acent-text-color)"}/>
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

					<Settings size={18} color={"var(--text-muted)"}/>
				</div>
				
			</div>

			<Book content={local_book ?? book}/>
		</div>
	)
}
