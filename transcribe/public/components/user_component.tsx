import styles from '../../styles/Home.module.css'
import _ from 'underscore'
import { supabase } from '@root/client';
import { LogOut, Settings } from 'react-feather';

const UserComponent: React.FC<{ user: any }> = ({ user }) => {
    return (
        <div className={styles.userComponent}>
            <p>
                {
                    user?.username
                }
            </p>
            <div onClick={() => {
                supabase.auth.signOut();
            }}>
                <LogOut size={18} color={"var(--text-muted)"}/>
            </div>
        </div>
    )
}

export default UserComponent;