import { File, MessageSquare } from 'react-feather'
import styles from '../../styles/Home.module.css'
import RelativeTime from '@yaireo/relative-time'
import Link from 'next/link'

const ProjectCard: React.FC<{ content: any }> = ({ content }) => {
    return (
        // <Link href={`/editor/${content.id}`}>
        //     <div className=" bg-[#fff] dark:bg-backgroundDark border-2 border-borderDefault dark:border-borderDefaultDark min-w-[350px] w-[25%] rounded-md overflow-hidden hover:cursor-pointer hover:border-borderHover hover:bg-backgroundHover">
        //         <div className={styles.cardTitle}>
        //             <h1>{ content.name }</h1> 
        //         </div>

        //         <div className="flex flex-row items-center gap-[2.2rem] p-4 border-b-[1px] border-b-borderDefault">
        //             <div className="flex flex-row items-center gap-2">
        //                 <File size={13}/>
        //                 <p className="m-0">
        //                     { content.document_count ? `${content.document_count} Documents` : '0 Documents' }
        //                 </p>
        //             </div>
                    
        //             <div className="flex flex-row items-center gap-2">
        //                 <MessageSquare size={13}/>
        //                 <p className="m-0">
        //                     { content.annotations ? `${content.annotations} Annotations` : '0 Annotations' }
        //                 </p>
        //             </div>
        //         </div>

        //         <div className="border-b-0 flex flex-row items-center gap-[.6rem] py-2 px-4">
        //             Last Edited: { new RelativeTime().from(new Date(content.last_edited)) }
        //         </div>
        //     </div>
        // </Link>

        <Link href={`/editor/${content.id}`}>
            <div className="group  bg-[#fff] dark:bg-backgroundDark border-[1.5px] border-borderDefault dark:border-borderDefaultDark min-w-[350px] w-[25%] rounded-md overflow-hidden hover:cursor-pointer hover:border-borderHoverLight dark:hover:border-borderHover dark:hover:bg-backgroundHover">
                <div className="text-textDefault dark:text-textColorDark px-4 py-[10px] text-lg border-b-[1px] border-borderDefault dark:border-borderDefaultDark group-hover:dark:border-borderHover group-hover:border-borderHoverLight">
                    <h1>{ content.name }</h1> 
                </div>

                <div className="flex flex-row items-center gap-[2.2rem] p-4 text-textColor dark:text-textColorDarkMuted dark:group-hover:text-textColorDark">
                    <div className="flex flex-row items-center gap-2">
                        <File size={13}/>
                        <p className="m-0">
                            { content.document_count ? `${content.document_count} Documents` : '0 Documents' }
                        </p>
                    </div>
                    
                    <div className="flex flex-row items-center gap-2">
                        <MessageSquare size={13}/>
                        <p className="m-0">
                            { content.annotations ? `${content.annotations} Annotations` : '0 Annotations' }
                        </p>
                    </div>
                </div>

                <div className="border-b-0 flex flex-row items-center gap-[.6rem] py-3 px-4 text-textColor dark:text-textColorDarkMuted dark:group-hover:text-textColorDark">
                    Last Edited: { new RelativeTime().from(new Date(content.last_edited)) }
                </div>
            </div>
        </Link>
    )
}

export default ProjectCard;