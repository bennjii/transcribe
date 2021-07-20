import styles from '@styles/Home.module.css'
import { Router, useRouter } from 'next/router';

const Header: React.FC<{ }> = ({ }) => {
    const router = useRouter();

    return (
        <div className={styles.logo}>
            <p onClick={() => {
                router.push('/');
            }}>transcribe</p> 
            <h4>beta</h4>
        </div>
    )
}

export default Header;