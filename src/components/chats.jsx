import { useContext, useEffect, useState } from "react"
import { auth, firestore } from "../utils/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { ChatContext } from "../utils/chatContext"


export default function Chats() {
    const [ chats, setChats ] = useState([])
    const [ user ] = useAuthState(auth)

    const { dispatch } = useContext(ChatContext)

    useEffect(() => {
        const getChats = () => {
            const unsubscribe = firestore.collection('userChats').doc(user.uid).onSnapshot((doc) => { 
                setChats(doc.data()) 
            })
            
            return () => unsubscribe();
        }
        
        user.uid && getChats()
    }, [user.uid])
    
    const handleSelect = (u) => {
        dispatch({ type: 'CHANGE_USER', payload: u })
    }


    return (
        <div className="flex flex-col gap-3">
            {chats && Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
                <div key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)} className="flex items-center gap-3 px-4 py-2 dark:border dark:border-main_light_dark dark:bg-dark bg-main_text text-main_light dark:hover:border-main_light_gray hover:bg-main_dark cursor-pointer rounded-xl anim-500">
                    <img className="w-12 h-12 rounded-full object-cover" src={chat[1].userInfo.photoURL} />
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold">{chat[1].userInfo.username}</span>
                        <span className="text-main_light_gray">{chat[1].lastMessage?.text}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}