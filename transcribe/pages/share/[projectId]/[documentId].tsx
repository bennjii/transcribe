
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
import { GetServerSideProps, GetServerSidePropsContext, GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
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

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
  ) => {
    const DOCUMENT = context.params.documentId;
    const INDEX = context.params.projectId;

	const project = await supabase
		.from('projects')
		.select()
		.eq('id', INDEX)
		.then(e => {
            const data = e.data[0].file_structure;
            let document;

            const reccursion = (element: Folder) => {
                return element?.children?.forEach(_element => {
                    if(_element.id == DOCUMENT) { 
                        document = _element;
                        return true;
                    }else return _element.is_folder ? reccursion( _element) : null;
                });
            }

            reccursion(data);

            if(!document || document?.settings?.share == false) return "404";
            else return document;
		});

    return {
        props: {
            project: project,
            index: INDEX,
            document: DOCUMENT
        }
    }
}

export default function Share({ project }) {
    if(project == "404") return (
        <div className={styles.Error404}>
            <h1>404</h1>
            <Header />

            <div>
                <h2>This document either does not exist or has restricted access</h2>
                <p>If someone sent you this link, ask them to check document access</p>
            </div>
        </div>
    );

    const [ projectState, setProjectState ] = useState<Folder>(project);
	const [ activeEditor, setActiveEditor ] = useState<File | Folder>(project.is_folder ? project.children[0] : project);
	const [ user, setUser ] = useState(null);
	const [ synced, setSynced ] = useState(false);

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
		//@ts-expect-error
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

						{
							projectState.is_folder ? 
							<div className={styles.folderStructure} key={`FOLDERCOMPONENT-${projectState.id}`}>
								<div className={styles.folderTitle}>
									<p>{projectState?.name}</p>
								</div>
								
								{/* <FileStructure current_folder={projectState.file_structure} key={`FILESTRUCT-${projectState.id}`}/> */}
								{
									projectState?.children?.map((data, index) => {
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
							:
							<></>
						}
					</div>

					<UserComponent user={user}/>
				</div>

				<div className={styles.content}>
					<div className={styles.bookOverTools}>
						<div className={styles.bookToolTable}> 
							<CustomToolbar />
						</div>
						
						<div className={`${styles.syncStatus} ${styles.viewOnlySync}`}>
							{
                                <div>View Only</div>
							}
							
						</div>
					</div>

					<div>
						{
							(() => {
								switch(activeEditor?.type) {
									case "document":
										return <Book viewOnly/>
									case "book":
										return <Book viewOnly/>
									case "artifact":
										return <></>
									case "vision_board":
										return <VisionBoard viewOnly/>
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
