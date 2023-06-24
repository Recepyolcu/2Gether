import { useContext } from "react"
import { ChatContext } from '../utils/chatContext'
import MessageInput from "./messasgeInput"
import Messages from "./messages"
import { BsThreeDots } from 'react-icons/bs'
import { Link } from "react-router-dom"

export default function Chat(props) {
    const { data } = useContext(ChatContext);
    const { showMenu, setShowMenu } = props.menu

    return (
        <div className="w-full h-full max-sm:p-4 max-sm:pb-40">
            {!props.user && <div className={`w-full flex justify-end ${data.user.username != undefined && 'justify-between' } dark:bg-main_text border border-main_text px-4 py-3 h-20 rounded-xl`}>
                {data.user.username && <Link to={`/${data.user?.username}`} className="flex gap-3 items-center">
                    <img className="w-12 h-12 rounded-full object-cover" src={data.user?.photoURL} alt="" />
                    <span className="text-xl font-semibold">{data.user?.username}</span>    
                </Link>}
                <div className="flex items-center">
                    <button onClick={() => setShowMenu(!showMenu)} className="w-10 h-10 p-1 flex justify-center items-center rounded-full border border-main_light_dark dark:hover:border-main_light_gray anim-500"><BsThreeDots className="text-xl dark:text-main_light" /></button>
                </div>
            </div>}
            <div className="w-full h-full flex flex-col justify-between overflow-y-auto max-h-[910px]">
                <Messages user={props.user} />
            </div>
            <MessageInput />
        </div>
    )
}