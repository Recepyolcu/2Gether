
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { auth, checkUserExists, firestore } from '../utils/firebase'
import firebase from 'firebase/compat/app'
import Signin from '../components/signin'
import Signup from '../components/signup'
import Spinner from '../components/spinner'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function Login() {
    const [ isSignup, setIsSignup ] = useState(true);
    const [ user, loading ] = useAuthState(auth)
    const [ loginLoading, setLoginLoading ] = useState(false);
    const [ error, setError ] = useState('')

    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();

    const signin = async (provider) => {
        setLoginLoading(true)
        if(provider == 'google') {
            await signInWithPopup(auth, googleProvider)
            .then(async (userCredential) => {
                const userExist = await checkUserExists(userCredential.user.uid) 
                if(!userExist) {
                    const user = userCredential.user;
                    firestore.collection('users').doc(user.uid).set({
                        uid: user.uid,
                        bio: '',
                        email: user.email,
                        photoURL: user.photoURL,
                        phone_number: user.phoneNumber,
                        createdAt: firebase.firestore.Timestamp.now(),
                        saves: [],
                        joins: [],
                        gender: 'Erkek',
                        account_type: 'Public',
                        banned: false,
                        interests: [],
                        user_name: null,
                        followers: 0,
                        follows: 0
                    });
                    return <Navigate to={'create_profile'} />
                }
                return <Navigate to={'/'} />
            })
            .catch((error) => {
                console.log(error.code)
                setError(error.code)
            })
            .finally(() => {
                setLoginLoading(false)
            })
        }
        if(provider == 'github') {
            await signInWithPopup(auth, githubProvider)
            .then(async (userCredential) => {
                const userExist = await checkUserExists(userCredential.user.uid) 
                if(!userExist) {
                    const user = userCredential.user;
                    firestore.collection('users').doc(user.uid).set({
                        uid: user.uid,
                        bio: '',
                        email: user.email,
                        photoURL: user.photoURL,
                        phone_number: user.phoneNumber,
                        createdAt: firebase.firestore.Timestamp.now(),
                        saves: [],
                        joins: [],
                        gender: 'Erkek',
                        account_type: 'Public',
                        banned: false,
                        interests: [],
                        user_name: null,
                        followers: 0,
                        follows: 0
                    });
                    return <Navigate to={'/create_profile'} />
                }
                return <Navigate to={'/'} />
            })
            .catch((error) => {
                console.log(error)
                setError(error)
            })
            .finally(() => {
                setLoginLoading(false)
            })
        }        
        
    }

    if(!loading && user) {
        return <Navigate to={'/'} />
    }

    if(!loading) {
        return (
            <div className='bg-white dark:bg-dark relative flex max-xl:flex-col items-center'>
                <Link to={'/'} className='effect absolute left-5 top-5 font-gilroy font-bold text-3xl z-30'>2Gether</Link>
                <div className='w-1/2 p-36 rounded-3xl bg-white dark:bg-dark dark:text-main_light mx-auto flex flex-col justify-center gap-6 max-xl:w-9/12 max-xl:absolute max-xl:bottom-36 max-xl:top-36 max-2xl:p-20 max-[500px]:px-5 max-sm:w-full max-sm:h-full max-sm:top-0 max-sm:bottom-0 max-sm:rounded-none max-sm:border-none max-xl:border max-xl:border-main_light_gray max-xl:shadow-xl max-md:text-sm'>
                        <motion.button onClick={() => signin('google')} type='button' className="w-full flex gap-6 items-center justify-center border-[3px] border-main_text dark:border-main_light_dark rounded-lg px-6 py-4 text-main_text dark:text-main_light font-necto_mono font-semibold text-lg hover:bg-main_light dark:hover:bg-main_text dark:hover:border-main_light_gray anim-500 max-md:text-sm"><FcGoogle className='text-2xl' />Google ile devam et{loginLoading && <Spinner />}</motion.button>
                        <motion.button onClick={() => signin('github')} type='button' className="w-full flex gap-6 items-center justify-center border-[3px] border-main_text dark:border-main_light_dark rounded-lg px-6 py-4 text-main_text dark:text-main_light font-necto_mono font-semibold text-lg hover:bg-main_light dark:hover:bg-main_text dark:hover:border-main_light_gray anim-500 max-md:text-sm"><FaGithub className='text-2xl' />Github ile devam et{loginLoading && <Spinner />}</motion.button>
                        <div className='flex items-center gap-3'>
                            <div className='w-full h-[2px] bg-main_light dark:bg-main_dark_orange opacity-60'></div>
                            <span className='dark:text-main_light'>veya</span>
                            <div className='w-full h-[2px] bg-main_light dark:bg-main_dark_orange opacity-60'></div>
                        </div>
                        <div className='w-8/12 max-md:w-10/12 mx-auto flex justify-between'>
                            <button type='button' className={`w-1/2 border-b-[4px] py-4 ${isSignup ? 'border-main_light' : 'border-main_text'}`} onClick={() => setIsSignup(true)}>Hesap Oluştur</button>
                            <button type='button' className={`w-1/2 border-b-[4px] py-4 ${isSignup ? 'border-main_text' : 'border-main_light'}`} onClick={() => setIsSignup(false)}>Giriş Yap</button>
                        </div>
                        {isSignup ? <Signup /> : <Signin />}
                        {error && <span>{error}</span>}
                </div>
                <div className="w-1/2 flex-1 flex items-center h-screen max-xl:w-full">
                    <img className='h-screen object-cover' src="/img/pexels-home-friends.jpg" alt="friends" />
                </div>
            </div>
        )
    }
}