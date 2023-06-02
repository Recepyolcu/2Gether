import { useContext, useState } from 'react'
import { BiSend } from 'react-icons/bi'
import { ChatContext } from '../utils/chatContext'
import { firestore } from '../utils/firebase'
import { useUser } from '../utils/firestoreUserContext'
import  firebase  from 'firebase/compat/app'
import { v4 as uuidv4 } from 'uuid';

export default function MessageInput() {
    const [ text, setText ] = useState('');
    const { user } = useUser()
    const { data } = useContext(ChatContext)

    const handleSendMessage = async () => {
        await firestore.collection('chats').doc(data.chatId).update({
            messages: firebase.firestore.FieldValue.arrayUnion({
                id: uuidv4(),
                text,
                senderId: user.uid,
                date: firebase.firestore.Timestamp.now()
            })}
        )

        await firestore.collection('userChats').doc(user.uid).update({
            [data.chatId + '.lastMessage']: {
                text,
            },
            [data.chatId + '.date']: firebase.firestore.FieldValue.serverTimestamp()
        })
        await firestore.collection('userChats').doc(data.user.uid).update({
            [data.chatId + '.lastMessage']: {
                text,
            },
            [data.chatId + '.date']: firebase.firestore.FieldValue.serverTimestamp()
        })

        setText('')
    }
    
    return (
        <div className="w-full relative">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="mesaj..." type="text" className="absolute bottom-0 left-0 right-0 flex gap-6 px-6 items-center justify-center disabled:bg-main_light_dark disabled:hover:pl-6 bg-main_text dark:bg-main_text border border-main_text dark:border-main_light_dark rounded-lg p-3 text-main_light text-lg placeholder:text-main_light hover:pl-8 focus:pl-8 outline-none anim-500 peer max-md:text-sm" />
            <button onClick={handleSendMessage} type="button" className="text-main_light absolute right-2 bottom-2.5 p-1.5 text-2xl rounded-lg dark:peer-focus:bg-main_light_dark peer-focus:bg-main_light_dark anim-500"><BiSend /></button>
        </div>
    )
}