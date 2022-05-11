import styles from '@styles/Home.module.css'
import Head from 'next/head';
import { Router, useRouter } from 'next/router';
import Link from 'next/link'

const Header: React.FC<{ }> = ({ }) => {
    const router = useRouter();

    return (
        // className="border-b-[var(--border-color)] border-[1px]
        <div className="py-4 px-8 flex flex-col sm:flex-row items-center justify-center md:justify-between sm:border-b-borderDefault sm:dark:border-b-borderDefaultDark sm:border-b-[1px]">
            <Head>
                <title>transcribe</title>
                <link rel="icon" href="/favicon/32-bold.png" type="image/png" />
            </Head>

            <a href="/" className="md:hidden px-2 h-7 items-center justify-center flex text-accentTextColor dark:text-textColorDark italic text-xl pr-3 pb-1 rounded-[12px]">
                t
            </a>
            <a href="/" className="m-0 hidden md:flex cursor-pointer text-[1.1rem] text-textColor dark:text-textColorDark">transcribe</a> 
            <h4 className="text-accentTextColor hidden md:flex dark:text-accentTextColor font-psans m-0 font-normal text-base">beta</h4>
        </div>
    )
}

export default Header;