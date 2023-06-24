import { useUser } from "../utils/firestoreUserContext"
import Chat from "../components/chat"
import Chats from "../components/chats"
import UserSearch from "../components/userSearch"
import { useState } from "react"

export default function MessagesPage() {
    const { loading } = useUser()
    const [ showMenu, setShowMenu ] = useState(false)
    
    
    if(!loading) {
        return (
            <div className="w-full flex gap-6">
                <div className="w-full flex flex-col justify-between p-8 max-sm:p-0 dark:bg-dark bg-main_light text-main_text dark:text-main_light rounded-xl sm:border border-main_text dark:border-main_light_dark overflow-hidden">
                    <Chat menu={{ showMenu, setShowMenu }} />
                </div>
                <div className={`w-[500px] ${showMenu ? 'flex' : 'hidden'} max-sm:absolute max-sm:w-full flex flex-col gap-3 p-4 dark:bg-dark bg-main_light text-main_text dark:text-main_light rounded-xl border border-main_text dark:border-main_light_dark overflow-hidden`}>
                    <UserSearch menu={{ showMenu, setShowMenu }} />
                    <Chats />
                </div>
                
            </div>
        )
    }
}