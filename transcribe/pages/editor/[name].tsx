
import Head from 'next/head'
import { ArrowRight, Book as BookIcon, BookOpen, ChevronDown, Circle, Edit3, FileText, Settings } from 'react-feather'

import Book from '@components/book';
import BookChapter from '@components/book_chapter';
import BookInput from '@components/book_input';
import { stringToJSON } from '@components/convert';
import CustomToolbar from '@components/custom_toolbar';
import styles from '@styles/Home.module.css'

import Header from '@components/header'
import UserComponent from '@components/user_component';
import { useEffect } from 'react';
import { supabase } from '@root/client';
import { useState } from 'react';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { File, Folder, Project } from '@public/@types/project';
import FileStructure from '@components/file_structure';
import ProjectContext from '@public/@types/project_context';
import FileComponent from '@components/file_component';

import { recursivelyIdentify } from '@public/@types/project'
import Editor from '@components/editor';

export const getStaticPaths: GetStaticPaths = async (a) => {
    const projects = await supabase
        .from('projects')
        .select('*')
        .then(e => e.data)

    const paths = projects?.map((article) => ({
        params: { name: article.id.toString() },
    }))

    return {
        paths: paths, //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}

export const getStaticProps: GetStaticProps = async (
    context: GetStaticPropsContext
  ) => {
    const INDEX = context.params.name;

    return {
        props: {
            project: await supabase
                        .from('projects')
                        .select()
                        .eq('id', INDEX)
                        .then(e => {
                            return e.data[0];
                        }),
            index: INDEX
        }
    }
}

export default function Home({ project }) {
    const [ projectState, setProjectState ] = useState<Project>(project);
	const [ activeEditor, setActiveEditor ] = useState<File | Folder>(null);
	const [ user, setUser ] = useState(null);

	useEffect(() => {
		// find id and set them to active editors...
		if (!activeEditor) recursivelyIdentify(projectState, setActiveEditor);
		else if(activeEditor.id !== projectState.active_file && activeEditor) recursivelyIdentify(projectState, setActiveEditor);
	}, [, projectState.active_file])

	useEffect(() => {
        supabase
            .from('users')
            .select(`
                id,
                username,
                creation_date
            `)
            .eq('id', supabase.auth.user().id)
            .then(e => {                
                setUser({ ...e.data[0] });
            });
    }, [])

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

	return (
		<ProjectContext.Provider value={{ project: projectState, projectCallback: setProjectState, editor: activeEditor, editorCallback: setActiveEditor }}>
			<div className={styles.container}>
				<Head>
					<title>Wintersteel</title>
					<meta name="viewport" content="maximum-scale=1.5, initial-scale: 1.5, width=device-width" />
				</Head>
				
				<div className={styles.header}>
					{/* Header */}
					<Header />

					<div className={styles.project}>
						<div>
							<h2>{projectState?.name}</h2>

							<ArrowRight size={18} strokeWidth={2}/>
						</div>
						

						<div className={styles.folderStructure}>
							<div className={styles.folderTitle}>
								<p>{projectState?.name}</p>
								{/* <ChevronDown size={18}/> */}
							</div>
							
							{
								projectState.file_structure.children.map((data, index) => {
									return (
										data.is_folder ? 
										<FileStructure current_folder={data} key={`${index} -- ${data.name}`} />
										:
										//@ts-expect-error
										<FileComponent data={data} key={`FILE-${data.id}`} />
									)
								})
							}
							
							
							{/* <div className={styles.folder}>
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
							</div>  */}
							
						</div>
						
					</div>

					<UserComponent user={user}/>
					
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
					</div>
					
				</div>
				
			</div>
		</ProjectContext.Provider>
	)
}
