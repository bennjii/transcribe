import styles from '../../styles/Home.module.css'
import _ from 'underscore'
import { supabase } from '@root/client';
import { Book as BookIcon, ChevronDown, Folder as FolderIcon, LogOut, Settings } from 'react-feather';
import { Folder } from '@public/@types/project';
import ProjectContext from '@public/@types/project_context';
import { useContext } from 'react';
import FileComponent from './file_component';
import FolderComponent from './folder_component';

const FileStructure: React.FC<{ current_folder: Folder }> = ({ current_folder }) => {
    const { project, projectCallback } = useContext(ProjectContext);

    return (
        <div className={styles.folder}>
            {
                current_folder.is_folder 
                && <FolderComponent data={current_folder}/>
            }

            <div>
                {
                    current_folder?.children?.map((data) => {
                        return (
                            data.is_folder ? 
                            <FileStructure current_folder={data} key={`FILESTRUCT-${data.id}`}/>
                            :
                            //@ts-expect-error
                            <FileComponent data={data} key={`FILE-${data.id}`}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default FileStructure;