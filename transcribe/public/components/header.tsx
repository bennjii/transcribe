import styles from '@styles/Home.module.css'
import Head from 'next/head';
import { Router, useRouter } from 'next/router';

const Header: React.FC<{ }> = ({ }) => {
    const router = useRouter();

    return (
        <div className={styles.logo}>
            <Head>
                <title>Next App</title>
                <link rel="icon" href="/favicon/32t.png" type="image/png" />
            </Head>

            <p onClick={() => {
                router.push('/');
            }}>transcribe</p> 
            <h4>beta</h4>
        </div>
    )
}

export default Header;