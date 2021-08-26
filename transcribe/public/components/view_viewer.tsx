import { File, Home, MessageSquare } from 'react-feather'
import styles from '../../styles/Home.module.css'
import RelativeTime from '@yaireo/relative-time'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import HomeContext from '@public/@types/home_context'
import ProjectCard from './project_card'

const Viewer: React.FC<{ }> = ({ }) => {
    const { page, info } = useContext(HomeContext);
    const [ active, setActive ] = useState(page);

    useEffect(() => {
        setActive(page);
    }, [page]);

    return (
        <div className={styles.projectView}>
            {
                (() => {
                    switch(active) {
                        case "home-page":
                            return (
                                <>
                                    <h1>Hello, {info.username}</h1>

                                    <div>
                                        
                                    </div>
                                </>   
                            )
                        case "projects-page":
                            return (
                                <>
                                    <h1>Your Projects</h1>

                                    <div>
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