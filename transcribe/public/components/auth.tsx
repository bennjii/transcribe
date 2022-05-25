
import { SupabaseClient } from '@supabase/supabase-js'
import styles from '@styles/Auth.module.css'
import { useState } from 'react'

import Button from '@components/button'
import Input from '@components/input'
import { callbackify } from 'util'
import { AlertCircle, Check } from 'react-feather';
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Auth: React.FC<{ client: SupabaseClient }> = ({ client }) => {
    const [ authState, setAuthState ] = useState('auth-login');
    const [ authInputState, setAuthInputState ] = useState({
        email: "",
        password: "",
        username: ""
    });

    const [ authError, setAuthError ] = useState("");
    const router = useRouter();

    useEffect(() => {
        setAuthError(null);
    }, [authState])

	return (
		<div className="bg-bgLight sm:bg-accentPageBg text-textColor h-full w-full min-w-[100vw] min-h-[100vh] flex flex-row justify-around items-center font-psans ">
            <h1 className="absolute top-0 left-0 py-8 px-12 m-0 font-light text-lg text-textColor" style={{ fontFamily: "PT Serif" }}>transcribe</h1>
            
            <div className="w-full sm:w-max bg-bgLight p-8 sm:rounded-md sm:border-[1px] sm:border-borderDefault flex flex-row justify-between items-center">
                <div className="sm:min-w-[400px] w-full">
                    {
                        (authState == 'auth-login') ?
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col">
                                <h2 className="font-semibold text-headerPrimary m-0 mb-2 text-xl leading-7">Welcome Back!</h2>
                                <h3 className="font-light text-base m-0 text-headerSecondary">We're so excited to see you again!</h3>
                            </div>
                            
                            <div className={styles.authInput}>
                                <Input title={"EMAIL"} type="email" defaultValue={authInputState.email} onChange={(e) => setAuthInputState({ ...authInputState, email: e.target.value })}/>
                                <br />
                                <Input title={"PASSWORD"} type="password" defaultValue={authInputState.password} onChange={(e) => setAuthInputState({ ...authInputState, password: e.target.value })}/>
                                <a href="" className="text-[.8rem] font-normal text-textLink m-0 mt-2">forgot your password?</a>
                            </div>

                            {
                                authError && <div className={styles.authError}><AlertCircle size={18} color={"var(--text-negative)"}/><p>{authError}</p></div>
                            }

                            <div className="flex flex-col gap-2">
                                <Button title={"Login"} onClick={(_, callback) => {
                                    client.auth.signIn({
                                        email: authInputState.email,
                                        password: authInputState.password,
                                    }).then(e => {
                                        if(e.error) setAuthError(e.error.message)
                                        else {
                                            setAuthError(null);

                                            if(router?.query?.u) {
                                                console.log(`/editor/${router?.query?.u}`);
                                                router.push(`/editor/${router?.query?.u}`);
                                            }
                                        }

                                        callback()
                                    })
                                }}/>
                                <p className="text-[.8rem] text-channelsDefault mb-0">Don't have an account? <a href="#" className="text-[.8rem] font-normal text-textLink m-0 mt-2" onClick={() => setAuthState('auth-signup')}>Sign Up</a></p> 
                            </div>
                        </div>
                        :
                        (authState !== "auth-email") ?
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col">
                                <h2 className="font-semibold text-headerPrimary m-0 mb-2 text-xl leading-7">Create an Account</h2>
                                <h3 className="font-light text-base m-0 text-headerSecondary">We're so excited to see you!</h3>
                            </div>
                            
                            <div className={styles.authInput}>
                                <Input title={"USERNAME"} defaultValue={authInputState.username} type="text" onChange={(e) => setAuthInputState({ ...authInputState, username: e.target.value })}/>
                                <br />
                                <Input title={"EMAIL"} defaultValue={authInputState.email} type="email" onChange={(e) => setAuthInputState({ ...authInputState, email: e.target.value })}/>
                                <br />
                                <Input title={"PASSWORD"} defaultValue={authInputState.password} type="password" onChange={(e) => setAuthInputState({ ...authInputState, password: e.target.value })}/>
                            </div>

                            {
                                authError && <div className={styles.authError}><AlertCircle size={18} color={"var(--text-negative)"}/><p>{authError}</p></div>
                            }

                            <div className="flex flex-col gap-2">
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

                                                return;
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
                                <p className="text-[.8rem] text-channelsDefault mb-0">Already have an account? <a className="text-[.8rem] font-normal text-textLink m-0 mt-2" href="#" onClick={() => setAuthState('auth-login')}>Log in</a></p> 
                            </div>
                        </div>
                        :
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col">
                                <h2 className="font-semibold text-headerPrimary m-0 mb-2 text-xl leading-7">Create an Account</h2>
                                <h3 className="font-light text-base m-0 text-headerSecondary">We're so excited to see you!</h3>
                            </div>
                            
                            <div className="flex flex-col text-textColor items-center justify-center flex-1 h-full gap-4 min-h-[250px]">
                                <div className={styles.authSuccessCircle}>
                                    <Check color={"white"} size={64}/>
                                </div>
                                
                                <div className="flex flex-col items-center">
                                    <h1 className="font-black m-0 text-[2rem] text-headerPrimary">Success</h1>
                                    <h3 className="font-extralight text-headerSecondary m-0 text-base">Please verify your email</h3>
                                </div>
                                
                            </div>

                            <div>
                                <p className="text-[.8rem] text-channelsDefault mb-0">Haven{'\''}t received an email? <a className="text-[.8rem] font-normal text-textLink m-0 mt-2" href="#" onClick={() => setAuthState('auth-login')}>Re-send</a></p> 
                            </div>
                        </div>
                    }
                </div>
            </div> 

            <div>{"\t"}</div>
        </div>
	)
}

export { Auth }