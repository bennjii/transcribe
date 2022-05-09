import { File, Home, MessageSquare } from 'react-feather'
import styles from '../../styles/Home.module.css'
import RelativeTime from '@yaireo/relative-time'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import HomeContext from '@public/@types/home_context'

const NavItem: React.FC<{ name: string, link: string, icon: any }> = ({ name, link, icon }) => {
    const { page, pageCallback } = useContext(HomeContext);
    const [ active, setActive ] = useState(page == link);

    useEffect(() => {
        setActive(page == link);
    }, [page]);

    return (
        <div 
            className={`flex flex-row items-center font-medium text-[.95rem] gap-4 px-4 py-[0.6rem] rounded-md cursor-pointer dark:text-textColorDarkMuted  ${active && 'bg-accentBgColor dark:bg-accentTextColorDark dark:text-bgLight'}`}
            onClick={() => pageCallback(link)}
        >
            { icon }

            { name }
        </div>
    )
}

export default NavItem;