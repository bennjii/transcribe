import styles from '../../styles/Home.module.css'
import _ from 'underscore'
import { supabase } from '@root/client';
import { LogOut, Minimize, Settings } from 'react-feather';

const UserComponent: React.FC<{ user: any, buttonCallback?: Function }> = ({ user, buttonCallback }) => {
    return (
        <div className="hidden sm:flex flex-row md:justify-between justify-center items-center p-[1.4rem] border-t-[1px] border-t-borderDefault">
            <p className="text-textColor dark:text-textColorDarkMuted hidden md:flex">
                {
                    user?.username
                }
            </p>
            <div onClick={() => {
                if(buttonCallback) buttonCallback(true);
                else {
                    supabase.auth.signOut();
                }
            }}>
                {
                    buttonCallback ? 
                    <Minimize></Minimize>
                    :
                    <LogOut size={18} color={"var(--text-muted)"}/>
                }
                
            </div>
        </div>
    )
}

export default UserComponent;