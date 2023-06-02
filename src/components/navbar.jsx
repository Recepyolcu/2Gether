import { BiWorld, BiMoon } from 'react-icons/bi'
import { AiOutlineMenu } from 'react-icons/ai'
import { useTheme } from '../utils/theme-context'
import { FiSun } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useState } from 'react'
    
export default function Navbar() {
    const { theme, toggleTheme } = useTheme()
    const [ menu, toggleMenu ] = useState(false)

    return (
        <header className='glassmorphism shadow-md z-30 flex max-sm:flex-col max-sm:gap-6 justify-between w-full fixed top-0 right-0 xl:px-[180px] px-20 py-10 max-sm:py-8 anim-500'>
            <div className='w-full flex justify-between'>
                <div className='w-1/2 items-center'>
                    <button className='p-2 rounded-xl hover:bg-main_text hover:text-main_light anim-500' onClick={toggleTheme}>{theme === 'dark' ? <BiMoon className='text-xl' /> : <FiSun className='text-xl' />}</button>
                </div>
                <button onClick={() => toggleMenu(!menu)} className='sm:hidden p-2 rounded-xl hover:bg-main_text hover:text-main_light anim-500'><AiOutlineMenu className='text-xl' /></button>
            </div>
            <nav className={`sm:w-full max-sm:p-2 max-sm:border-t max-sm:border-main_light_gray min-w-max font-gilroy font-bold flex sm:justify-end max-sm:justify-start max-sm:${menu ? 'flex' : 'hidden'}`}>   
                <ul className='flex max-sm:flex-col gap-6 sm:items-center'>
                    <li><Link to='/login' className='relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-main_orange after:scale-x-0 hover:after:scale-x-100 after:duration-300 after:origin-bottom-right hover:after:origin-bottom-left'>Giriş Yap</Link></li>
                    <li><Link to='/login' className='px-6 py-2 text-white bg-main_dark_orange rounded-lg hover:text-main_text anim-500'>Kaydol</Link></li>
                </ul>
            </nav>
        </header>
    )
}