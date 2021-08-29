
import Head from 'next/head'
import { ArrowRight, Book as BookIcon, BookOpen, ChevronDown, Circle, Edit3, FileText, Plus, Settings } from 'react-feather'

import Book from '@components/book';
import BookChapter from '@components/book_chapter';
import BookInput from '@components/book_input';
import { stringToJSON } from '@components/convert';
import CustomToolbar from '@components/custom_toolbar';
import styles from '@styles/Home.module.css'

import Header from '@components/header'
import UserComponent from '@components/user_component';
import { useCallback, useEffect } from 'react';
import { supabase } from '@root/client';
import { useState } from 'react';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { File, Folder, Project } from '@public/@types/project';
import FileStructure from '@components/file_structure';
import ProjectContext from '@public/@types/project_context';
import FileComponent from '@components/file_component';

import { recursivelyIdentify } from '@public/@types/project'
import Editor from '@components/editor';
import debounce from '@public/@types/debounce';

import _ from 'underscore'
import NewFileModal from '@components/new_file_modal';
import { useModal } from '@geist-ui/react';
import VisionBoard from '@components/vision_board';

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

	const project = await supabase
		.from('projects')
		.select()
		.eq('id', INDEX)
		.then(e => {
			return e.data[0];
		});

    return {
        props: {
            project: project,
            index: INDEX
        }
    }
}

export default function Home({ project }) {
    const [ projectState, setProjectState ] = useState<Project>(project);
	const [ activeEditor, setActiveEditor ] = useState<File | Folder>(null);
	const [ user, setUser ] = useState(null);
	const [ synced, setSynced ] = useState(false);

	useEffect(() => {
		// find id and set them to active editors...
		if (!activeEditor) recursivelyIdentify(projectState, setActiveEditor);
		else if(activeEditor.id !== projectState.active_file && activeEditor) recursivelyIdentify(projectState, setActiveEditor);
	}, [])

	const verif = useCallback(
		_.debounce((state) => {
			supabase
				.from('projects')
				.update({
					...state,
					last_edited: new Date() 
				})
				.match({ id: state.id })
				.then(e => {
					if(e.data) setSynced(true);
					else setSynced(false);
				});
		}, 1500)
		, []
	);

	useEffect(() => {
		setSynced(false);
		verif(projectState);
	}, [projectState.file_structure])

	useEffect(() => {
		if(supabase.auth.user()) 
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

	const { visible, setVisible, bindings } = useModal();

	return (
		<ProjectContext.Provider value={{ project: projectState, projectCallback: setProjectState, editor: activeEditor, editorCallback: setActiveEditor, synced: synced }}>
			<div className={styles.container}>
				<Head>
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
								
								<Plus size={16} strokeWidth={2} color={"var(--text-muted)"} onClick={() => setVisible(true)}/>
								<NewFileModal modal={{ visible, setVisible, bindings }} />
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
							{
								synced ? 
								<>
									Saved

									<div className={styles.syncTrue}>

									</div>
								</>
								:
								<>
									Unsaved
								</>
							}
							
						</div>
					</div>

					<div>
						{
							(() => {
								switch(activeEditor?.type) {
									case "document":
										return <Book />
									case "book":
										return <Book />
									case "artifact":
										return <></>
									case "vision_board":
										return <VisionBoard />
									case "folder":
										return <></>
								}
							})()
						}
					</div>
					
				</div>
				
			</div>
		</ProjectContext.Provider>
	)
}
