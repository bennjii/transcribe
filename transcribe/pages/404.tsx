import styles from '@styles/Home.module.css'
import Header from '@components/header';

export default function FourOhFour() {
    return (
        <div className={styles.Error404}>
            <h1>404</h1>
            <Header />

            <div>
                <h2>This page either does not exist or has restricted access</h2>
                <p>If someone sent you this link, ask them to check their access settings</p>
            </div>
        </div>
    );
}