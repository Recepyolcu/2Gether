import { useEffect, useState } from "react";
import { getUserEvents } from "../utils/firebase";
import { CgBox } from 'react-icons/cg'
import { BsCalendar3 } from 'react-icons/bs'
import { BiChat } from 'react-icons/bi'
import Event from '../components/event'
import Chat from '../components/chat'
import LgSpinner from '../components/spinner'

export default function UserPage(props) {
    const [ user, setUser ] = useState(null)
    const [ page, setPage ] = useState(1)
    const [ eventsLoading, setEventsLoading ] = useState(false)
    const [ events, setEvents ] = useState();


    useEffect(() => {
        setUser(props.user)
        getEvents()
    }, [user]);
    
    const getEvents = async () => {
        if(user) {
            setEventsLoading(true)
            const userEvents = await getUserEvents(user.uid)
            setEvents(userEvents)
            setEventsLoading(false)
        }
    }


    if (user) {
        return (
            <main className="w-full flex flex-col gap-10 xl:px-20">
                <div className="relative w-full flex flex-col gap-10 items-start sm:border max-sm:border-b border-main_light_dark dark:bg-dark bg-main_light sm:rounded-2xl shadow-lg p-3">
                    <div className='w-full flex gap-10 max-md:gap-4'>
                        <div>
                            <div className='max-md:w-20 max-md:h-20 w-28 h-28 rounded-full border dark:border-main_light_gray flex items-center justify-center shadow-lg anim-500'>
                                {user?.photoURL != null ? <img className="rounded-full w-full h-full shadow-lg border object-cover" src={user?.photoURL} alt="user_profile_photo" /> : <div className='max-md:w-20 max-md:h-20 w-28 h-28 rounded-full border dark:border-main_light_gray flex items-center justify-center shadow-lg'></div>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h1 className="font-semibold max-lg:text-lg text-2xl">{user?.user_name}</h1> 
                            <div>
                                <p className='mb-2'>{user.bio}</p>
                                <h3 className='font-semibold max-lg:text-base text-lg'>İlgi Alanları</h3>
                                <div className='flex gap-3 max-lg:text-sm'>
                                    {user?.interests}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full rounded-xl'> 
                        <div className='w-full flex gap-6 max-lg:gap-2 justify-evenly'>
                            <button onClick={() => setPage(1)} className={`sm:w-full max-sm:p-3 max-lg:text-sm border-[3px] border-main_light_gray hover:shadow-lg anim-500 dark:border-main_light_dark rounded-xl py-2 flex justify-center items-center gap-3 ${page == 1 ? 'dark:bg-main_light dark:text-main_text bg-main_text text-white' : 'dark:bg-dark dark:text-main_light bg-main_light text-main_text'}`} ><CgBox className='text-xl' /><span className="max-sm:hidden">Etkinlikler</span></button>
                            <button onClick={() => setPage(2)} className={`sm:w-full max-sm:p-3 max-lg:text-sm border-[3px] border-main_light_gray hover:shadow-lg anim-500 dark:border-main_light_dark rounded-xl py-2 flex justify-center items-center gap-3 ${page == 2 ? 'dark:bg-main_light dark:text-main_text bg-main_text text-white' : 'dark:bg-dark dark:text-main_light bg-main_light text-main_text'}`} ><BiChat className='text-lg' /><span className="max-sm:hidden">Mesaj</span></button>
                        </div>
                    </div>
                </div>
               <div className="relative h-full w-full sm:border bg-main_light dark:bg-dark border-main_text dark:border-main_light_dark rounded-2xl p-6">
                {page == 1 ? 
                        <>
                            {eventsLoading ? 
                            <LgSpinner />
                            : 
                            <div className='gap-6 grid 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1'>
                                {events && events.map((event) => (
                                    <Event key={event.id} content={event} />
                                ))}
                            </div>
                            }
                        </> : 
                    page == 2 && <Chat user={user} />}
               </div>
            </main>
        )
    }
}