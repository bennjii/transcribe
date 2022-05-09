import styles from '@styles/Home.module.css'
import Head from 'next/head';
import { Router, useRouter } from 'next/router';
import Link from 'next/link'

const Header: React.FC<{ }> = ({ }) => {
    const router = useRouter();

    return (
        // className="border-b-[var(--border-color)] border-[1px]
        <div className="py-4 px-8 flex flex-row items-center justify-between border-b-borderDefault dark:border-b-borderDefaultDark border-b-[1px]">
            <Head>
                <title>transcribe</title>
                <link rel="icon" href="/favicon/32-bold.png" type="image/png" />
            </Head>

            <a href="/" className="m-0 cursor-pointer text-[1.1rem] text-textColor dark:text-textColorDark">transcribe</a> 
            <h4 className="text-accentTextColor dark:text-accentTextColor font-psans m-0 font-normal text-base">beta</h4>
        </div>
    )
}

export default Header;