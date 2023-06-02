import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../utils/chatContext";
import { useUser } from "../utils/firestoreUserContext";

const Message = ({ message }) => {
    const { user } = useUser()
    const { data } = useContext(ChatContext);

    const ref = useRef();

    useEffect(() => {
            ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
        <div ref={ref} className={`flex ${message.senderId === user.uid ? 'justify-end' : 'justify-start'}`}>
            <div className={`w-fit flex gap-3 p-3 rounded-xl items-center ${message.senderId === user.uid ? 'flex-row-reverse border border-main_light_dark bg-main_text text-main_light pl-6' : 'justify-start border border-main_light_dark bg-main_text text-main_light pr-6'}`}>
                <img className="w-10 h-10 rounded-full object-cover" src={message.senderId === user.uid ? user.photoURL : data.user.photoURL} />
                <p>{message.text}</p>
            </div>
        </div>
    );
};

export default Message;