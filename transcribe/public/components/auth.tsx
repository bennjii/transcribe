
import { SupabaseClient } from '@supabase/supabase-js'
import clientStyles from '../../styles/Home.module.css'
import styles from '@styles/Auth.module.css'
import { useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { callbackify } from 'util'
import { AlertCircle, Check } from 'react-feather';
import { useEffect } from 'react'

const Auth: React.FC<{ client: SupabaseClient }> = ({ client }) => {
    const [ authState, setAuthState ] = useState('auth-login');
    const [ authInputState, setAuthInputState ] = useState({
        email: "",
        password: "",
        username: ""
    });

    const [ authError, setAuthError ] = useState("");

    useEffect(() => {
        setAuthError(null);
    }, [authState])

	return (
		<div className={styles.auth}>
            <div className={styles.authBox}>
                <div className={styles.authLeft}>
                    {
                        (authState == 'auth-login') ?
                        <div className={styles.authLogin}>
                            <div>
                                <h2>Welcome Back!</h2>
                                <h3>We're so excited to see you again!</h3>
                            </div>
                            
                            <div className={styles.authInput}>
                                <Input title={"EMAIL"} type="email" defaultValue={authInputState.email} onChange={(e) => setAuthInputState({ ...authInputState, email: e.target.value })}/>
                                <br />
                                <Input title={"PASSWORD"} type="password" defaultValue={authInputState.password} onChange={(e) => setAuthInputState({ ...authInputState, password: e.target.value })}/>
                                <a href="">forgot your password?</a>
                            </div>

                            {
                                authError && <div className={styles.authError}><AlertCircle size={18} color={"var(--text-negative)"}/><p>{authError}</p></div>
                            }

                            <div>
                                <Button title={"Login"} onClick={(_, callback) => {
                                    client.auth.signIn({
                                        email: authInputState.email,
                                        password: authInputState.password,
                                    }).then(e => {
                                        if(e.error) setAuthError(e.error.message)
                                        else setAuthError(null)

                                        callback()
                                    })
                                }}/>
                                <p>Don't have an account? <a href="#" onClick={() => setAuthState('auth-signup')}>Sign Up</a></p> 
                            </div>
                        </div>
                        :
                        (authState !== "auth-email") ?
                        <div className={styles.authLogin}>
                            <div>
                                <h2>Create an Account</h2>
                                <h3>We're so excited to see you!</h3>
                            </div>
                            
                            <div className={styles.authInput}>
                                <Input title={"EMAIL"} defaultValue={authInputState.email} type="email" onChange={(e) => setAuthInputState({ ...authInputState, email: e.target.value })}/>
                                <br />
                                <Input title={"USERNAME"} defaultValue={authInputState.username} type="text" onChange={(e) => setAuthInputState({ ...authInputState, username: e.target.value })}/>
                                <br />
                                <Input title={"PASSWORD"} defaultValue={authInputState.password} type="password" onChange={(e) => setAuthInputState({ ...authInputState, password: e.target.value })}/>
                            </div>

                            {
                                authError && <div className={styles.authError}><AlertCircle size={18} color={"var(--text-negative)"}/><p>{authError}</p></div>
                            }

                            <div>
                                <Button title={"Sign Up"} onClick={async (e, callback) => {
                                    if(authInputState.email && authInputState.password && authInputState.username) {
                                        const usr = await client.auth.signUp({
                                            email: authInputState.email,
                                            password: authInputState.password,
                                        }).then(u => {
                                            console.log(u.error)
                                            if(u.error)  {
                                                setAuthError(u.error?.message)
                                                callback();
                                            }
                                            else setAuthError(null)

                                            client.from('users').insert([
                                                {
                                                    id: u.user.id,
                                                    username: authInputState.username
                                                }
                                            ]).then(e => {
                                                callback();
                                                setAuthState('auth-email')
                                            });
                                        }).catch(e => {
                                            console.error(e)
                                        })
                                    }   
                                }}/>
                                <p>Already have an account? <a href="#" onClick={() => setAuthState('auth-login')}>Log in</a></p> 
                            </div>
                        </div>
                        :
                        <div className={styles.authLogin}>
                            <div>
                                <h2>Create an Account</h2>
                                <h3>We're so excited to see you!</h3>
                            </div>
                            
                            <div className={styles.authSuccess}>
                                <div className={styles.authSuccessCircle}>
                                    <Check color={"white"} size={64}/>
                                </div>
                                
                                <div>
                                    <h1>Success</h1>
                                    <h3>Please verify your email</h3>
                                </div>
                                
                            </div>

                            <div>
                                <p>Havent recieved an email? <a href="#" onClick={() => setAuthState('auth-login')}>Re-send</a></p> 
                            </div>
                        </div>
                    }
                </div>
                
                <div className={styles.authRight}>
                    {
                        //fetch(` https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${client.auth.session().provider_token}`)
                    }
                </div>
            </div> 

            <div>{"\t"}</div>
        </div>
	)
}

export { Auth }