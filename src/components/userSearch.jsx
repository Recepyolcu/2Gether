import { useState } from "react";
import { firestore, startChat } from "../utils/firebase";
import { useUser } from "../utils/firestoreUserContext";
import { AiOutlineClose } from 'react-icons/ai'

export default function UserSearch(props) {
    const { user } = useUser()
    const [ resUser, setResUser ] = useState(null)
    const [ error, setError ] = useState(false)
    const [ username, setUsername ] = useState('')
    const { showMenu, setShowMenu } = props.menu
    
    const handleSelect = async () => {
        startChat(user, resUser)
        setResUser(null);
        setUsername("")
    };

    const handleSearch = async () => {
        if (username != user.user_name) {
            const query = firestore.collection('users').where('user_name', '==', username)
            try {
                const querySnapshot = await query.get();
                querySnapshot.forEach((doc) => {
                    setResUser(doc.data());
                });
            } catch (error) {
                setError(true)
            }
        }
    };
    
    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    };
    
    return (
        <div>
            <div className="flex gap-2">
                <input placeholder="kullanıcı ara" value={username} onKeyDown={(e) => handleKey(e)} onChange={(e) => setUsername(e.target.value)} type="text" name="user_name" className="p-2 px-6 rounded-lg outline-none dark:bg-dark border dark:border-main_light_dark dark:hover:border-main_light_gray dark:focus:border-main_light_gray autofill:shadow-[0_0_0px_1000px_#171717_inset] dark:autofill:shadow-[0_0_0px_1000px_#171717_inset] autofill:focus:shadow-[0_0_0_1000px_#252525_inset] dark:autofill:focus:shadow-[0_0_0_1000px_#252525_inset] focus:pl-[30px] anim-500 w-full" />
                <button onClick={() => setShowMenu(!showMenu)} className="w-10 h-10 flex items-center justify-center border border-main_light_dark hover:border-main_light_gray rounded-full anim-500"><AiOutlineClose /></button>
            </div>
            {error && <span>kullanıcı bulunamadı</span>}
            {resUser && (
                <div onClick={handleSelect} className="mt-4 flex items-center gap-3 px-4 py-2 dark:border dark:border-main_light_dark dark:bg-dark bg-main_text text-main_light dark:hover:border-main_light_gray hover:bg-main_dark cursor-pointer rounded-xl anim-500">
                    <img className="w-12 h-12 rounded-full object-cover" src={resUser.photoURL} />
                    <div className="flex flex-col">
                        <span className="text-xl font-semibold">{resUser.user_name}</span>
                    </div>
                </div>
            )}
            
        </div>
    )
}