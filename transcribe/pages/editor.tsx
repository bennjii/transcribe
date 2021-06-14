
import Head from 'next/head'
import { ArrowRight, Book as BookIcon, BookOpen, ChevronDown, Circle, Edit3, FileText, Folder, Settings } from 'react-feather'
// import { Chapter } from '../public/@types/book';
import Book from '../public/components/book';
import BookChapter from '../public/components/book_chapter';
import BookInput from '../public/components/book_input';
import { stringToJSON } from '../public/components/convert';
import CustomToolbar from '../public/components/custom_toolbar';
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
					

					<div className={styles.folderStructure}>
						<div className={styles.folderTitle}>
							<p>Wintersteel</p>
							{/* <ChevronDown size={18}/> */}
						</div>
						
						<div className={styles.folder}>
							<div className={styles.openFolderHeader}>
								<ChevronDown size={18} color={"var(--acent-text-color)"} />
								<p>Manuscript</p>
							</div>

							<div>
								<div className={styles.openFile} draggable >
									<BookIcon size={18} color={"var(--acent-text-color)"}/>

									<p>Prologue</p>
								</div>

								<div className={styles.subFile} draggable>
									<BookIcon size={18} color={"var(--text-color)"}/>

									<p>Chapter 1</p>
								</div>

								<div className={styles.subFile} draggable>
									<BookIcon size={18} color={"var(--text-color)"}/>

									<p>Chapter 2/3</p>
								</div>

								<div className={styles.subFile} draggable>
									<Edit3 size={18} color={"var(--text-color)"}/>

									<p>Fight Scene 1</p>
								</div>
							</div>
						</div>
						
						<div className={styles.folder}>
							<div className={styles.folderHeader}>
								<Folder size={18} color={"var(--text-inactive)"}/>
								<p>Planning</p>
							</div>
							
						</div>

						<div className={styles.folder}>
							<div className={styles.folderHeader}>
								<Folder size={18} color={"var(--text-inactive)"}/>
								<p>Research</p>
							</div>
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

			<div className={styles.content}>
				<div className={styles.bookOverTools}>
					<div className={styles.bookToolTable}> 
						<CustomToolbar />
					</div>

					<div className={styles.syncStatus}>
						Saved

						<div className={styles.syncTrue}>

						</div>
					</div>
				</div>

				<div>
					<Book content={local_book ?? book}/>

					{/* <Book content={local_book ?? book}/> */}
				</div>
				
			</div>
			
		</div>
	)
}
