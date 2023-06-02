import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, firestore } from '../utils/firebase'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { AiOutlineEye } from 'react-icons/ai'
import firebase from 'firebase/compat/app'
import Spinner from '../components/spinner'
import { Navigate } from 'react-router-dom'

export default function Signup() {
    const [ passShow, setPassShow ] = useState(false) 
    const [ error, setError ] = useState('')
    const [ loading, setLoading ] = useState(false) 
    const [ data, setData ] = useState({})

    const handleChange = (e) => {
        if (e.target.value == '') e.target.style.borderColor = '#801010'
        else e.target.style.borderColor = '#454545'

        setData({ ...data, [e.target.name]: e.target.value})
    }

    const createUser = async () => {
        document.querySelectorAll('input').forEach((inp) => {
            if (inp.value == '') inp.style.borderColor = '#801010'
            else inp.style.borderColor = '#454545'
        })
        setLoading(true)

        await createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            setError('')
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
                banned: false,
                isVerified: false,
                interests: [],
                followers: 0,
                follows: 0
            });
            return <Navigate to={'/create_profile'} />
        })
        .catch((error) => {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError('Bu email kullanılıyor. giriş yapmayı dene.')
                    break;
                case 'auth/invalid-email':
                    setError('Hatalı veya yanlış email girişi yaptınız.')
                    break;
                case 'auth/invalid-password':
                    setError('Hatalı şifre girdiniz.')
                    break;
                case 'auth/invalid-phone-number':
                    setError('Hatalı telefon girişi')
                    break;
                default:
                    setError('Something went wrong')
                    break;
            }
        })
        .finally(() => {
            setLoading(false)
        })
        
    }

    const passTypeChange = () => {
        setPassShow(!passShow)
    }

    const form = {
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.3,
            },
        },
        hidden: {
            opacity: 0,
            transition: {
                when: "afterChildren",
            },
        },
    }
      
    const item = {
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 100 },
    }

    return (
        <motion.form variants={form} initial="hidden" animate="visible" className='flex flex-col mt-4'>
            <div className='flex flex-col gap-10 items-stretch'>
                <motion.div variants={item}>
                    <input id='email' name='email' onBlur={(e) => handleChange(e)} onChange={(e) => handleChange(e)} required className='p-4 px-6 rounded-lg outline-none dark:bg-dark border dark:border-main_light_dark dark:hover:border-main_light_gray dark:focus:border-main_light_gray autofill:shadow-[0_0_0px_1000px_#171717_inset] dark:autofill:shadow-[0_0_0px_1000px_#171717_inset] autofill:focus:shadow-[0_0_0_1000px_#252525_inset] dark:autofill:focus:shadow-[0_0_0_1000px_#252525_inset] focus:pl-[30px] anim-500 w-full' type="email" placeholder='Email' />
                </motion.div>
                <div>
                    <motion.div variants={item}>
                        <label className='relative flex justify-between items-center h-[52px]'>
                            <input id='password' name='password' onBlur={(e) => handleChange(e)} onChange={(e) => handleChange(e)} required className='p-4 px-6 rounded-lg outline-none dark:bg-dark border dark:border-main_light_dark dark:hover:border-main_light_gray dark:focus:border-main_light_gray autofill:shadow-[0_0_0px_1000px_#171717_inset] dark:autofill:shadow-[0_0_0px_1000px_#171717_inset] autofill:focus:shadow-[0_0_0_1000px_#252525_inset] dark:autofill:focus:shadow-[0_0_0_1000px_#252525_inset] focus:pl-[30px] anim-500 absolute left-0 right-0' type={passShow ? "text" : "password"} placeholder='Şifre' />
                            <motion.span variants={item} className='text-neutral-700 dark:text-neutral-500 cursor-pointer absolute right-4 text-xl' onClick={passTypeChange}><AiOutlineEye /></motion.span>
                        </label>
                    </motion.div>
                    {error && <span className='font-necto_mono text-sm text-red-600'>*{error}</span>}  
                </div>
                <motion.label variants={item} className='cbx-container'>
                    <input required className='cursor-pointer' type="checkbox" />
                    <span className='checkmark'></span>
                    <span className='ml-7'>2Gether <a className='text-main_dark_orange' href="">Kişisel Verilerin Korunması Politikası</a> kapsamındaki aydınlatma linkte belirtilmiştir. <a className='text-main_dark_orange' href="">Kullanıcı Sözleşmesi</a> 'ni onaylıyorum.</span>
                </motion.label>
                <motion.button variants={item} type='button' disabled={loading} onClick={createUser} className='border-[3px] border-main_text dark:border-main_light py-4 rounded-lg shadow-lg hover:border-main_dark_orange dark:hover:border-main_dark_orange duration-300 ease-out' style={loading && {borderColor: '#808080', color: '#808080'}}>
                    {loading && <Spinner />}
                    Hesap Oluştur
                </motion.button>
            </div> 
        </motion.form>
    )
}
