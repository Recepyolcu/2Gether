import { BiMinus, BiMoon, BiHomeAlt2, BiLogOut, BiChat, BiNotification } from 'react-icons/bi'
import { AiOutlinePlusSquare, AiOutlineMenu } from 'react-icons/ai'
import { HiOutlineUserCircle } from 'react-icons/hi'
import { FiSettings, FiSun } from 'react-icons/fi'
import { Link, Navigate } from 'react-router-dom'
import { useTheme } from '../utils/theme-context'
import { auth } from '../utils/firebase'
import { signOut } from 'firebase/auth'
import { useUser } from '../utils/firestoreUserContext'
import { useState, useEffect } from 'react'

export default function Sidebar(props) {
    const { shrink, setShrink } = props.shrink
    const { theme, toggleTheme } = useTheme()
    const { user } = useUser()
    
    const [ prevScrollY, setPrevScrollY ] = useState(0);
    const [ currentScrollY, setCurrentScrollY ] = useState(0);
    const [ isScrolledDown, setIsScrolledDown ] = useState(false)
    const currentPage = props.currentPage
    
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setPrevScrollY(currentScrollY);
            setCurrentScrollY(scrollY);
            if (prevScrollY < currentScrollY) {
                setIsScrolledDown(true)
            } else {
                setIsScrolledDown(false)
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [currentScrollY]);
    
    const handleSignOut = () => {
        signOut(auth);
        return <Navigate to={'/'} replace />
    }

    return(
        <nav className={`${!isScrolledDown ? 'max-sm:-bottom-1' : 'menu-popup'} w-1/6 max-sm:p-2 max-sm:w-11/12 border border-main_light_dark max-sm:rounded-t-xl rounded-r-xl bg-main_light dark:bg-dark text-main_text dark:text-main_light z-30 fixed sm:-left-1 sm:top-5 sm:bottom-5 anim-500 ${shrink ? 'w-20' : 'w-[290px]'}`}>
           <div className='flex flex-col gap-10 p-5 max-sm:p-1'>
            <div className='flex justify-between items-center p-3 max-sm:hidden' style={shrink ? {justifyContent: 'center'} : {}}>
                    {!shrink && <Link className='effect text-2xl font-gilroy font-bold max-sm:hidden' to={'/home'}>2Gether</Link>}
                    <button className='p-2 border-2 border-main_light_dark rounded-full' onClick={() => setShrink(!shrink)}>{!shrink ? <BiMinus className='text-2xl dark:text-main_light' /> : <AiOutlineMenu className='text-2xl dark:text-main_light' />}</button>
                </div>
                <ul className='flex sm:flex-col justify-stretch max-sm:justify-evenly gap-4 max-sm:gap-2' style={shrink ? {alignItems: 'center'} : {}}>
                    <li><Link to='/' className={`${currentPage == '/' && 'bg-main_text text-white'} w-full flex items-end gap-${shrink ? '0' : '5'}  max-sm:gap-0 p-3 rounded-lg hover:bg-main_text hover:text-white dark:hover:bg-main_text anim-500 font-normal text-xl group`} ><BiHomeAlt2 className='max-sm:text-xl text-3xl group-hover:scale-105 duration-200 ease-out'/><span className='max-sm:hidden'>{shrink ? '' : 'Anasayfa'}</span></Link></li>
                    <li><Link to={`/${user?.user_name}`} className={`${currentPage == `/${user?.user_name}` && 'bg-main_text text-white'} w-full flex items-center gap-${shrink ? '0' : '5'}  max-sm:gap-0 p-3 rounded-lg hover:bg-main_text hover:text-white dark:hover:bg-main_text anim-500 font-normal text-xl group`} ><HiOutlineUserCircle className='max-sm:text-xl text-3xl group-hover:scale-105 duration-200 ease-out' /><span className='max-sm:hidden'>{shrink ? '' : 'Profil'}</span></Link></li>
                    <li><Link to='/create_event' className={`${currentPage == '/create_event' && 'bg-main_text text-white'} w-full flex items-center gap-${shrink ? '0' : '5'}  max-sm:gap-0 p-3 rounded-lg hover:bg-main_text hover:text-white dark:hover:bg-main_text anim-500 font-normal text-xl group`} ><AiOutlinePlusSquare className='max-sm:text-xl text-3xl group-hover:scale-105 duration-200 ease-out' /><span className='max-sm:hidden'>{shrink ? '' : 'Etkinlik Oluştur'}</span></Link></li>
                    <li><Link to='/messages' className={`${currentPage == '/messages' && 'bg-main_text text-white'} w-full flex items-center gap-${shrink ? '0' : '5'}  max-sm:gap-0 p-3 rounded-lg hover:bg-main_text hover:text-white dark:hover:bg-main_text anim-500 font-normal text-xl group`} ><BiChat className='max-sm:text-xl text-3xl group-hover:scale-105 duration-200 ease-out' /><span className='max-sm:hidden'>{shrink ? '' : 'Mesajlar'}</span></Link></li>
                    <li className='font-necto_mono max-sm:hidden'>Sistem</li>
                    <li><button onClick={toggleTheme} className={`w-full flex items-center gap-${shrink ? '0' : '5'} max-sm:gap-0 p-3 rounded-lg hover:bg-main_text hover:text-white dark:hover:bg-main_text anim-500 font-normal text-xl group`} >{theme === 'dark' ? <BiMoon className='max-sm:text-xl text-3xl group-hover:scale-105 duration-200 ease-out' /> : <FiSun className='max-sm:text-xl text-3xl group-hover:scale-105 duration-200 ease-out' />}<span className='max-sm:hidden'>{shrink ? '' : 'Tema'}</span></button></li>
                    <li><button onClick={() => handleSignOut()} className={`w-full flex items-center gap-${shrink ? '0' : '5'} max-sm:gap-0 p-3 rounded-lg hover:bg-main_text hover:text-white dark:hover:bg-main_text anim-500 font-normal text-xl group`} ><BiLogOut className='max-sm:text-xl text-3xl group-hover:scale-105 duration-200 ease-out' /><span className='max-sm:hidden'>{shrink ? '' : 'Çıkış Yap'}</span></button></li>
                    <li><Link to={'/settings'} className={`w-full flex items-center gap-${shrink ? '0' : '5'} max-sm:gap-0 p-3 rounded-lg hover:bg-main_text hover:text-white dark:hover:bg-main_text anim-500 font-normal text-xl group`}><FiSettings className='max-sm:text-[16px] text-[23px] group-hover:scale-105 duration-200 ease-out' /><span className='max-sm:hidden'>{shrink ? '' : 'Ayarlar'}</span></Link></li>
                </ul>
           </div>
        </nav>
    ) 
}