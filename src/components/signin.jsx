import { AiOutlineEye } from 'react-icons/ai'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, checkUserExists } from '../utils/firebase';
import Spinner from '../components/spinner'

export default function Signin() {
    const [ passShow, setPassShow ] = useState(false) 
    const [ error, setError ] = useState('')
    const [ loading, setLoading ] = useState(false) 
    const [ data, setData ] = useState({})
    
    const passTypeChange = () => {
        setPassShow(!passShow);
    }

    const handleChange = (e) => {
        if (e.target.value == '') e.target.style.borderColor = '#801010'
        else e.target.style.borderColor = '#454545'

        let newInput = { [e.target.name]: e.target.value }
        setData({ ...data, ...newInput})
    }
    
    const userLogin = async () => {
        setLoading(true)
        await signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            setError('')
            if(checkUserExists(userCredential.user.uid) == false) {
                console.log('kullanıcı yok kayıt olması lazım')
            } else {console.log('user database de')}
        })
        .catch((error) => {
            switch (error.code) {
                case 'auth/invalid-email':
                    setError('Hatalı veya yanlış email girişi yaptınız.')
                    break;
                case 'auth/missing-email':
                    setError('Lütfen email giriniz')
                    break;
                case 'auth/user-not-found':
                    setError('Email bulunamadı. Hesabınız yoksa kaydolmayı deneyin.')
                    break;
                case 'auth/invalid-password':
                    setError('Hatalı şifre girdiniz.')
                    break;
                case 'auth/invalid-phone-number':
                    setError('Hatalı telefon girişi')
                    break;
                default:
                    setError('Something went wrong')
                    console.log(error)
                    break;
            }
        })
        .finally(() => {
            setLoading(false)
        })
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
        <motion.form variants={form} initial="hidden" animate="visible" className='flex flex-col'>
            <div className='flex flex-col gap-10 items-stretch'>
                <motion.input variants={item} id='email' name='email' onChange={handleChange} required className='p-4 px-6 rounded-lg outline-none dark:bg-dark border dark:border-main_light_dark dark:hover:border-main_light_gray dark:focus:border-main_light_gray autofill:shadow-[0_0_0px_1000px_#171717_inset] dark:autofill:shadow-[0_0_0px_1000px_#171717_inset] autofill:focus:shadow-[0_0_0_1000px_#252525_inset] dark:autofill:focus:shadow-[0_0_0_1000px_#252525_inset] focus:pl-[30px] anim-500 w-full' type="email" placeholder='Email' />
                <div className='flex flex-col items-center gap-2'>
                    <motion.label className='w-full relative flex justify-between items-center h-[52px] dark:'>
                        <motion.input variants={item} id='password' name='password' onChange={handleChange} required className='p-4 px-6 rounded-lg outline-none dark:bg-dark border dark:border-main_light_dark dark:hover:border-main_light_gray dark:focus:border-main_light_gray autofill:shadow-[0_0_0px_1000px_#171717_inset] dark:autofill:shadow-[0_0_0px_1000px_#171717_inset] autofill:focus:shadow-[0_0_0_1000px_#252525_inset] dark:autofill:focus:shadow-[0_0_0_1000px_#252525_inset] focus:pl-[30px] anim-500 w-full anim-500 absolute left-0 right-0' type={passShow ? "text" : "password"} placeholder='Şifre' />
                        <motion.span variants={item} className='text-neutral-700 dark:text-neutral-500 cursor-pointer absolute right-4 text-xl' onClick={passTypeChange}><AiOutlineEye /></motion.span>
                    </motion.label>
                    {error && <span className='font-necto_mono text-sm text-red-600'>*{error}</span>}
                </div>
                <motion.button variants={item} type='button' disabled={loading} onClick={userLogin}  className='border-[3px] border-main_text dark:border-main_light py-4 rounded-lg shadow-lg hover:border-main_dark_orange dark:hover:border-main_dark_orange duration-300 ease-out' style={loading && {borderColor: '#808080', color: '#808080'}}>
                    {loading && <Spinner />}
                    Giriş Yap
                </motion.button>
            </div>
        </motion.form>
    )
}

