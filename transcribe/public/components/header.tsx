import styles from '@styles/Home.module.css'
import Head from 'next/head';
import { Router, useRouter } from 'next/router';
import Link from 'next/link'

const Header: React.FC<{ }> = ({ }) => {
    const router = useRouter();

    return (
        <div className={styles.logo}>
            <Head>
                <title>transcribe</title>
                <link rel="icon" href="/favicon/32-bold.png" type="image/png" />
            </Head>

            <a href="/">transcribe</a> 
            <h4>beta</h4>
        </div>
    )
}

export default Header;