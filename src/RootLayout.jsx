import Sidebar from "./components/sidebar"
import { useState, useEffect } from "react"
import { useTheme } from "./utils/theme-context"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "./utils/firebase"
import { useLocation } from "react-router-dom"
import { ChatContextProvider } from "./utils/chatContext"

export default function RootLayout({children}) {
    const { theme, loadingTheme } = useTheme()
    const [ shrink, setShrink ] = useState(false)
    const [ user, loading ] = useAuthState(auth)
    const location = useLocation()

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1280) {
                setShrink(true)
            } 
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    if(!loadingTheme && !loading) {
        if(user) {
            return (
                <div className={theme}>
                    <div className='min-h-screen flex justify-center dark:bg-dark dark:text-main_light'>
                        <Sidebar shrink={{shrink, setShrink}} currentPage={location.pathname} />
                        <main className={`w-full flex min-h-screen justify-center sm:p-5 anim-500 max-sm:ml-0 ${shrink ? 'ml-[80px]' : 'ml-[290px]'}`}>
                            <ChatContextProvider>
                                {children}
                            </ChatContextProvider>
                        </main>
                    </div>
                </div>
            )
        } else {
            return (
                <main className={theme}>
                    {children}
                </main>
            )
        }
    }
}