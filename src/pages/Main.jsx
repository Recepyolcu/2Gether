import Navbar from '../components/navbar'
import Hero from '../components/hero'
import InfoSection from '../components/infoSection'
import { useTheme } from '../utils/theme-context'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../utils/firebase'

export default function Main() {
    const { theme } = useTheme()
    const [ user, loading ] = useAuthState(auth)

    if(!loading && !user) {
        return (
            <div className={theme}>
                <div className="dark:bg-dark dark:text-main_light">
                    <div className="bg-main_bg dark:bg-main_text dark:text-main_light">
                        <Navbar />
                        <div className="text-main_text flex flex-col">
                            <Hero />
                            <InfoSection />
                        </div>
                    </div>
                </div>
            </div>
        )   
    }
}