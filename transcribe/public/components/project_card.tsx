import { File, MessageSquare } from 'react-feather'
import styles from '../../styles/Home.module.css'

import Link from 'next/link'

const ProjectCard: React.FC<{ content: any }> = ({ content }) => {
    const document_count = '1' // count from file structre.

    return (
        <Link href={`/editor/${content.id}`}>
            <div className={styles.projectCard}>
                <div className={styles.cardTitle}>
                    <h1>{ content.name }</h1> 
                </div>

                <div>
                    <div>
                        <File size={13}/>
                        <p>
                            { content.document_count ? `${content.document_count} Documents` : '0 Documents' }
                        </p>
                    </div>
                    
                    <div>
                        <MessageSquare size={13}/>
                        <p>
                            { content.annotations ? `${content.annotations} Annotations` : '0 Annotations' }
                        </p>
                    </div>
                </div>

                <div>
                    Last Edited: {
                        Math.round((new Date().getTime() - new Date(content.last_edited).getTime()) / 1000 / 60 / 60)
                    } Hours ago
                </div>
            </div>
        </Link>
    )
}

export default ProjectCard;