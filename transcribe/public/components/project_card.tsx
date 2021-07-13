import { File, MessageSquare } from 'react-feather'
import styles from '../../styles/Home.module.css'

const ProjectCard: React.FC<{ content: any }> = ({ content }) => {
    const document_count = '1' // count from file structre.

    return (
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
                </div> 510957
            </div>

            <div>
                Edited: {
                    new Date().getTime() - content.last_edited
                }

                Created: {
                    content.creation_date
                }
            </div>
        </div>
    )
}

export default ProjectCard;