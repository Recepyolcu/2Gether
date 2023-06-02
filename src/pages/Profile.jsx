import { firestore, getUserEvents, uploadPhoto } from '../utils/firebase';
import { useUser } from '../utils/firestoreUserContext';
import { useEffect, useState } from 'react';
import { BsPlus } from 'react-icons/bs'
import { BiSave } from 'react-icons/bi'
import { CgBox } from 'react-icons/cg'
import { MdOutlineJoinInner } from 'react-icons/md'
import Event from '../components/event'
import LgSpinner from '../components/spinner';
import { Link } from 'react-router-dom';

export default function  Profile() {
    const [ eventsLoading, setEventsLoading ] = useState(false)
    const [ page, setPage ] = useState(1)
    const [ events, setEvents ] = useState()
    const [ savedEvents, setSavedEvents ] = useState()
    const [ joinedEvents, setJoinedEvents ] = useState()
    const { user, loading } = useUser()

    useEffect(() => {
        setPage(1)
        if(!loading) {
            getEvents()
        }
        getSavedEvents()
        getJoinedEvents()
    },[])
    
    const getEvents = async () => {
        setEventsLoading(true)
        if(!loading) {
            const userEvents = await getUserEvents(user.uid)
            setEvents(userEvents)
            setEventsLoading(false)
        }
    }

    const getSavedEvents = async () => {
        const saves = (await firestore.collection('users').doc(user?.uid).get()).data().saves
        const savedEvents = []

        saves.forEach((save) => {
            firestore.collection('events').where('eventID', '==', save).get().then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    savedEvents.push(doc.data())
                })
            })
        })
        setSavedEvents(savedEvents)
    }

    const getJoinedEvents = async () => {
        const joins = (await firestore.collection('users').doc(user?.uid).get()).data().joins
        const arr = []

        joins.forEach((join) => {
            firestore.collection('events').where('eventID', '==', join).get().then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    arr.push(doc.data())
                })
            })
        })
        setJoinedEvents(arr)
    }

    const handleProfileImage = async (e) => {
        if (e.target.files[0].size < 3145728) {
            await uploadPhoto(user.uid, e.target.files[0], `users/${user.uid}/profilePhoto.jpg`).then(() => {
                console.log('Profil resmi başarıyla yüklendi ve Firestore kaydedildi.');
            }).catch((error) => {
                console.error('Profil resmi yükleme hatası:', error);
            })
        } 
    }

    if(!loading) {
        return (
            <main className="w-full flex flex-col gap-10 xl:px-20">
                <div className="relative w-full flex flex-col gap-10 items-start sm:border max-sm:border-b border-main_light_dark bg-main_light dark:bg-dark sm:rounded-2xl shadow-lg p-3 md:p-8">
                    <div className='w-full flex gap-10 max-md:gap-4'>
                        <form>
                            <label className='max-md:w-20 max-md:h-20 w-28 h-28 rounded-full border dark:border-main_light_gray flex items-center justify-center shadow-lg anim-500 cursor-pointer'>
                                {user?.photoURL ? <img className="rounded-full w-full h-full border shadow-lg object-cover" src={user.photoURL} alt="user_profile_photo" /> : <div className='w-full h-full rounded-full border dark:border-main_light_gray flex items-center justify-center shadow-lg'><BsPlus className='text-4xl max-md:text-3xl text-main_light_gray' /></div>}
                                <input onChange={(e) => handleProfileImage(e)} className="hidden" type="file" accept="image/*" name="photoURL"/>
                            </label>
                        </form>
                        <div className="w-full flex flex-col gap-2">
                            <div className="flex gap-8 items-start justify-between">
                                <div className='flex flex-col gap-2'>
                                    <h1 className="font-semibold max-lg:text-lg text-2xl">{user?.user_name}</h1> 
                                    <p className='mb-2'>{user?.bio}</p>
                                </div>
                                <Link to={'/edit_profile'} className="max-lg:px-2 px-4 py-1 border border-main_text dark:border-main_light_gray dark:hover:border-main_light anim-500 rounded-lg text-sm">Profili düzenle</Link> 
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className='font-semibold max-lg:text-base text-lg'>İlgi Alanları</h3>
                        <div className='flex flex-wrap gap-3 max-lg:text-sm'>
                            {user?.interests.map((interest) => (
                                <div className='px-2 py-1 bg-main_text rounded-xl text-main_light'>{interest}</div>
                            ))}
                        </div>
                    </div>
                    <div className='w-full rounded-xl'> 
                        <div className='w-full flex gap-6 max-lg:gap-2 justify-evenly'>
                            <button onClick={() => setPage(1)} className={`sm:w-full max-sm:p-3 max-lg:text-sm border-[3px] border-main_light_gray hover:shadow-lg anim-500 dark:border-main_light_dark rounded-xl py-2 flex justify-center items-center gap-3 ${page == 1 ? 'dark:bg-main_light dark:text-main_text bg-main_text text-white' : 'dark:bg-dark dark:text-main_light bg-main_light text-main_text'}`} ><CgBox className='text-xl' /><span className='max-sm:hidden'>Etkinliklerim</span></button>
                            <button onClick={() => setPage(2)} className={`sm:w-full max-sm:p-3 max-lg:text-sm border-[3px] border-main_light_gray hover:shadow-lg anim-500 dark:border-main_light_dark rounded-xl py-2 flex justify-center items-center gap-3 ${page == 2 ? 'dark:bg-main_light dark:text-main_text bg-main_text text-white' : 'dark:bg-dark dark:text-main_light bg-main_light text-main_text'}`} ><BiSave className='text-xl' /><span className='max-sm:hidden'>Kaydedilenler</span></button>
                            <button onClick={() => setPage(3)} className={`sm:w-full max-sm:p-3 max-lg:text-sm border-[3px] border-main_light_gray hover:shadow-lg anim-500 dark:border-main_light_dark rounded-xl py-2 flex justify-center items-center gap-3 ${page == 3 ? 'dark:bg-main_light dark:text-main_text bg-main_text text-white' : 'dark:bg-dark dark:text-main_light bg-main_light text-main_text'}`} ><MdOutlineJoinInner className='text-xl' /><span className='max-sm:hidden'>Katıldıklarım</span></button>
                        </div>
                    </div>
                </div>
                <div className='sm:border bg-main_light dark:bg-dark border-main_text dark:border-main_light_dark rounded-2xl p-6'>
                {page == 1 ?
                    <div>
                        {eventsLoading ? <LgSpinner />
                        : 
                        <div className='gap-6 grid 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1'>
                            {events && events.map((event) => (
                                <Event key={event.id} content={event} profile={true} />
                            ))}
                        </div>}
                    </div>

                    : page == 2 ?
                        <div className='gap-6 grid 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1'>
                            {savedEvents && savedEvents.map((event) => (
                                <Event key={event.id} content={event} />
                            ))}
                        </div>
                    :
                    <div className='gap-6 grid 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1'>
                        {joinedEvents && joinedEvents.map((event) => (
                            <Event key={event.id} content={event} />
                        ))}
                    </div>

                    }
                </div>
            </main>
        )
    }
}