import { useEffect, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useUser } from '../utils/firestoreUserContext'
import { firestore } from '../utils/firebase'
import EditEvent from './editEvent'
import { Link } from 'react-router-dom'

export default function Hit({hit}) {
    const { user, loading } = useUser()
    const [ edit, setEdit ] = useState(false)
    const [ isDeleted, setIsDeleted ] = useState(false)
    const [ data, setData ] = useState({
        title: hit.title,
        description: hit.description,
        photoURL: hit.photoURL,
        category: hit.category,
        startsAt: hit.startsAt,
        creatorID: hit.creatorID,
        eventID: hit.eventID,
        comments: hit.comments,
        participants: hit.participants
    })

    useEffect(() => {
        getCreator()
    }, [])
    
    const getCreator = async () => {
        try {
            const userDocRef = firestore.collection('users').doc(hit.creatorID);
            const doc = await userDocRef.get();
        
            if (doc.exists) {
                const userName = doc.data().user_name;
                const userPhotoURL = doc.data().photoURL;
                setData({...data, creatorUserName: userName, creatorPhotoURL: userPhotoURL});
            }
        } catch (error) {
            console.log('Error fetching creator:', error);
        }
    };

    const handleEventEdit = () => {
        setEdit(!edit)
    }

    const EditButton = () => {
        return (
            <button onClick={handleEventEdit} className='p-2 dark:bg-dark bg-main_light border dark:border-main_light_dark border-main_light_gray dark:text-main_light_gray shadow-lg rounded-full hover:-translate-y-0.5 anim-500' style={{position: 'absolute', top: '10px', right: '10px', zIndex: '10px'}}>
                <BsThreeDotsVertical />
            </button>
        )
    }

    if (!loading) {
        return (
            <div>
                {edit && <EditEvent data={{ data, setData }} edit={{ edit, setEdit }} isDeleted={{ isDeleted, setIsDeleted }} />}
    
                {!edit &&
                    <div className={`min-w-[270px]  flex flex-col gap-3 relative px-4 p-4 dark:bg-main_text bg-main_light border-2 border-main_light_gray dark:border-main_light_dark rounded-2xl shadow-lg overflow-hidden`}>
                       <div className='flex flex-col gap-6'>
                            <div className='w-full flex justify-between pb-3 items-center font-semibold border-b border-main_light_gray dark:border-main_light_dark'>
                                <Link to={`/${data.creatorUserName}`} replace className='flex items-center gap-3'>
                                    <img className='w-10 h-10 rounded-full object-cover' src={data.creatorPhotoURL} alt="userPhoto" />
                                    <span className='text-lg max-lg:text-base'>{data.creatorUserName}</span>
                                </Link>
                                {data.creatorID == user.uid && <EditButton />}
                            </div>
                            {data.creatorID == user.uid && <EditButton />}
                            <div className="flex flex-col gap-6 justify-between text-main_dark dark:text-main_light">
                                <img className={`h-80 max-sm:w-full max-[400px]:h-60 xl:h-96 rounded-xl border dark:border-main_light_dark object-cover anim-500`} src={data.photoURL} alt="activity"/>
                                <div className='flex flex-col'>
                                    <div className="flex flex-col sm:h-36 sm:justify-between gap-3">
                                        <h2 className="max-lg:text-xl text-2xl max-sm:text-base font-gilroy font-bold capitalize">{data.title}</h2>
                                        <p className='sm:min-h-[70px] max-lg:text-xs text-base'>{data.description}</p>
                                    </div>
                                </div>
                            </div>
                       </div>
                       <div className='flex flex-col gap-3'>
                            <div className="w-full flex justify-between font-semibold max-lg:text-xs cursor-default">
                                <p className='px-5 py-2 rounded-xl text-main_light bg-main_text dark:bg-dark border dark:border-main_light_dark'>{data.category}</p>
                                <p className='px-5 py-2 rounded-xl text-main_light bg-main_text dark:bg-dark border dark:border-main_light_dark'>{data.startsAt}</p>
                            </div>
                            <Link to={`/events/${data.eventID}`} className='text-center max-sm:text-sm text-main_light bg-main_text dark:bg-dark py-2 rounded-xl border border-main_light_dark'>Etkinlik Sayfasına Git</Link>
                       </div>
                    </div>
                }
            </div>
        )
    }
}