import { useState, useContext, useEffect } from "react"
import { ChatContext } from "../utils/chatContext"
import { firestore } from "../utils/firebase"
import Message from "./message"

export default function Messages(props) {
    const [ messages, setMessages ] = useState([])
    const { data } = useContext(ChatContext)
    const { dispatch } = useContext(ChatContext)


    useEffect(() => {
        props.user && dispatch({ type: 'CHANGE_USER', payload: props.user })
    }, [])
    
    useEffect(() => {
        const unsub = firestore.collection('chats').doc(data.chatId).onSnapshot((doc) => {
            doc.exists && setMessages(doc.data().messages)
        })
        return () => unsub()
    }, [data.chatId])

    return (
        <div>
            <div className="flex flex-col gap-3 p-4">
                {messages && messages.map((msg) => (
                    <Message message={msg} key={msg.id} />
                ))}
            </div>
        </div>
    )
}