
import Head from 'next/head'
import { ArrowRight, Book as BookIcon, BookOpen, ChevronDown, Circle, Edit3, FileText, Maximize, Plus, Settings } from 'react-feather'

import Book from '@components/book';
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
import { Dot, useModal } from '@geist-ui/react';
import VisionBoard from '@components/vision_board';
import ProjectModal from '@components/project_modal';

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
  ) => {
    const INDEX = context.params.name;
	const { user } = await supabase.auth.api.getUserByCookie(context.req);

	if (!user) {
		// If no user, redirect to index.
		await supabase.auth.refreshSession();
		return { props: {}, redirect: { destination: `/?u=${INDEX}`, permanent: true } }
	}

	console.log((new Date().getTime() - new Date(user.updated_at).getTime()) / 1000 / 60)


	const project = await supabase
		.from('projects')
		.select()
		.eq('id', INDEX)
		.then(e => {
            const owner = e?.data?.[0]?.owner;

            if(owner == user.id) return e.data[0]

			// Add to the editors in preferences so that it can be used here!
			else if(e?.data?.[0]?.settings?.editors?.includes(user?.id)) return e.data[0];
			else return "404";
		});

    return {
        props: {
            project: project,
            index: INDEX,
        }
    }
}

export default function Home({ project }) {
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

    const [ projectState, setProjectState ] = useState<Project>(project);
	const [ activeEditor, setActiveEditor ] = useState<File | Folder>(null);
	const [ user, setUser ] = useState(null);
	const [ synced, setSynced ] = useState(false);

	const [ fullView, setFullView ] = useState(false);

	useEffect(() => {
		// find id and set them to active editors...
		if (!activeEditor) recursivelyIdentify(projectState, setActiveEditor);
		else if(activeEditor.id !== projectState.active_file && activeEditor) recursivelyIdentify(projectState, setActiveEditor);
	}, [])

	useEffect(() => {
		const dStyle = document.getElementById('embeddedStyles');
		if(activeEditor?.settings?.theme == "dark") {
			dStyle.innerHTML = `.ql-snow * {
				font-family: "Caecilia" !important;
				color: #c1c1c1 !important;
				line-height: 1.5rem !important;
				font-size: 11px;
			  }`;
		}else {
			dStyle.innerHTML = `.ql-snow * {
				font-family: "Caecilia" !important;
				color: #131214 !important;
				line-height: 1.5rem !important;
				font-size: 11px;
			  }`;
		}

		const aStyle = document.getElementById("appliedStyles");
		if(activeEditor?.settings?.theme == "dark") {
			aStyle.innerHTML = `
				::-webkit-scrollbar {
					width: 4px;
				}

				/* Track */
				::-webkit-scrollbar-track {
					border-radius: 5px;
				}
				
				/* Handle */
				::-webkit-scrollbar-thumb {
					background: #414141;
					border-radius: 5px;
				}

				/* Handle on hover */
				::-webkit-scrollbar-thumb:hover {
					background: #c1c1c1; 
				}
			`
		}else {
			aStyle.innerHTML = `
				::-webkit-scrollbar {
					width: 4px;
				}

				/* Track */
				::-webkit-scrollbar-track {
					border-radius: 5px;
				}
				
				/* Handle */
				::-webkit-scrollbar-thumb {
					background: #c1c1c1; 
					border-radius: 5px;
				}

				/* Handle on hover */
				::-webkit-scrollbar-thumb:hover {
					background: #414141; 
				}
			`
		}
	}, [projectState])

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
					console.log(e);
					
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
	const { visible: projectVisible, setVisible: setProjectVisible, bindings: projectBindings } = useModal();

	return (
		<ProjectContext.Provider value={{ project: projectState, projectCallback: setProjectState, editor: activeEditor, editorCallback: setActiveEditor, synced: synced }}>
			<style id="embeddedStyles"></style>
			<style id="appliedStyles"></style>

			<div className="flex flex-row h-screen overflow-hidden">
				<Head>
					<meta name="viewport" content="maximum-scale=1.5, initial-scale: 1.5, width=device-width" />
				</Head>

				{
					fullView ?
					<div></div>
					:
					<div className="bg-[#fff] w-72 font-normal max-h-screen text-lg h-full border-r-borderDefault border-r-[1px] leading-5 grid" style={{ fontFamily: "PT Serif", gridTemplateRows: "62px 1fr 65px" }}>
						{/* Header */}
						<Header />

						<ProjectModal modal={{ projectVisible, setProjectVisible, projectBindings }}/>

						<div className={styles.project} style={{ height: "100%", overflow: "hidden" }}>
							<div onClick={() => setProjectVisible(true)}>
								<h2>{projectState?.name}</h2>

								<ArrowRight size={19} strokeWidth={2}/>
							</div>

							<div className={styles.folderStructure} style={{ overflowY: "auto" }} key={`FOLDERCOMPONENT-${projectState.id}`}>
								<div className={styles.folderTitle}>
									<p>{projectState?.name}</p>
									
									<Plus size={16} strokeWidth={2} color={"var(--text-muted)"} onClick={() => setVisible(true)}/>
									<NewFileModal modal={{ visible, setVisible, bindings }} location={project.file_structure} isProjectRoot/>
								</div>
								
								{/* <FileStructure current_folder={projectState.file_structure} key={`FILESTRUCT-${projectState.id}`}/> */}
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

						<UserComponent user={user} buttonCallback={setFullView}/>
						
					</div>
				}

				<div className="flex flex-row flex-1 bg-[#fff]">
					{
						(() => {
							switch(activeEditor?.type) {
								case "document":
									return <Book viewOnly={false}/>
								case "book":
									return <Book viewOnly={false}/>
								case "artifact":
									return <></>
								case "vision_board":
									return <VisionBoard />
								case "folder":
									return <></>
							}
						})()
					}

					{
						fullView ? (
							<div className="absolute left-0 bottom-0 p-5">
								<Maximize color={activeEditor?.settings?.theme == "light" ? "#000" : "#c1c1c1"}  onClick={() => {
									setFullView(false)
								}}></Maximize>
							</div>
						) : <></>
					}
				</div>
			</div>
		</ProjectContext.Provider>
	)
}
