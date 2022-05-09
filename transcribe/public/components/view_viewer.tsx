import { File, Home, MessageSquare, Plus } from 'react-feather'
import styles from '../../styles/Home.module.css'
import RelativeTime from '@yaireo/relative-time'
import { useContext, useEffect, useState } from 'react'
import HomeContext from '@public/@types/home_context'
import ProjectCard from './project_card'
import Link from 'next/link'
import { CreateModal } from './create_modal'
import { useModal } from '@geist-ui/react'

const Viewer: React.FC<{ }> = ({ }) => {
    const { page, info } = useContext(HomeContext);
    const [ active, setActive ] = useState(page);

    const { visible, setVisible, bindings } = useModal();

    useEffect(() => {
        setActive(page);
    }, [page]);

    return (
        <div className="bg-bgLight dark:bg-bgDark p-16 font-psans flex flex-col gap-8 overflow-auto">
            {
                (() => {
                    switch(active) {
                        case "projects-page":
                            return (
                                <>
                                    <div className={styles.projectPageHeader}>
                                        <CreateModal modal={{ visible, setVisible, bindings }} />
                                        <h1 className="font-base text-xl text-textColor dark:text-textColorDark">Your Projects</h1>

                                        <div className="text-textColor dark:text-textColorDark flex flex-row items-center gap-4" onClick={() => {
                                            setVisible(!visible);
                                        }}>
                                            Create Project

                                            <Plus size={22} strokeWidth={1}/>
                                        </div>
                                    </div>
                                    

                                    <div className={styles.projectList}>
                                        {
                                            info?.projects?.map(e => {
                                                return <ProjectCard content={e} key={`Card-${e.name}`}/>
                                            })
                                        }
                                    </div>
                                </>   
                            )
                        default:
                            return <></>
                    }
                })()
            }
            
        </div>
    )
}

export default Viewer;