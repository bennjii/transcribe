import styles from '../../styles/Home.module.css'
import _ from 'underscore'
import { supabase } from '@root/client';
import { Book as BookIcon, ChevronDown, Folder as FolderIcon, LogOut, Settings } from 'react-feather';
import { Folder } from '@public/@types/project';
import ProjectContext from '@public/@types/project_context';
import { useContext, useState } from 'react';
import FileComponent from './file_component';
import FolderComponent from './folder_component';

const FileStructure: React.FC<{ current_folder: Folder }> = ({ current_folder }) => {
    const [ expanded, setExpanded ] = useState(false);

    return (
        <div 
            className={styles.folder}
            key={`FILESTRUCTURE-${current_folder.id}`}
        >
            {
                current_folder.is_folder 
                && <FolderComponent data={current_folder} callback={setExpanded} value={expanded}/>
            }

            <div>
                {
                    expanded || current_folder.type == "book" ? 
                    current_folder?.children?.map((data) => {
                        return (
                            data.is_folder ? 
                            <FileStructure current_folder={data} key={`FILESTRUCT-${data.id}`}/>
                            :
                            //@ts-expect-error
                            <FileComponent data={data} key={`FILE-${data.id}`} parent={current_folder}/>
                        )
                    })
                    :
                    <></>
                }
            </div>
        </div>
    )
}

export default FileStructure;