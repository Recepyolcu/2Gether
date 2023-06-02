import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { firestore, getUserEvents } from "../utils/firebase"
import firebase from "firebase/compat/app"
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from 'react-icons/md'
import Event from "../components/event";
import { useUser } from "../utils/firestoreUserContext";

export default function EventPage() {
    const { user } = useUser()
    const [ eventData, setEventData ] = useState(null);
    const [ usersOtherEvents, setUsersOtherEvents ] = useState(null)
    const [ isSaved, setIsSaved ] = useState(false)
    const [ isJoined, setIsJoined ] = useState(false)
    const [ creator, setCreator ] = useState({});
    const [ participants, setParticipants ] = useState([])
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState('');
    const [ popup, setPopup ] = useState({
        opacity: '0',
        display: 'none', 
        message: ''
    })
    const eventID = useParams().event_id;

    const usersRef = firestore.collection('users')
    const userDoc = firestore.collection('users').doc(user?.uid)

    const getSave = async () => {
        const query = await usersRef.where('saves', 'array-contains', eventID).get()
        if (query.empty) {
            setIsSaved(false)
        } else {
            setIsSaved(true)
        }
    }

    const getJoin = async () => {
        if (eventData.participants.includes(user?.uid)) {
            setIsJoined(true)
        } else {
            setIsJoined(false)
        }
    }

    useEffect(() => {
        getEvent();
    }, [eventID]);
    
    useEffect(() => {
        if (eventData) {
            const getEvents = async () => {
                const userEvents = await getUserEvents(eventData.creatorID)
                setUsersOtherEvents(userEvents)
            }
            getSave()
            getJoin()
            getEvents()
            getCreator()
            getParticipants()
        }
    }, [eventData]);

    const getCreator = async () => {
        try {
            setLoading(true);
            const doc = await firestore.collection('users').doc(eventData.creatorID).get();
            const creatorData = doc.data();
            setCreator({
                id: creatorData.uid,
                username: creatorData.user_name,
                photoURL: creatorData.photoURL 
            });
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const getEvent = async () => {
        try {
            const doc = await firestore.collection('events').doc(eventID).get();
            setEventData(doc.data());
            setError('');
        } catch (error) {
            setPopup({...popup,opacity: '100', display: 'block', message: 'Etkinlik alınırken bir sorun çıktı'})
            setTimeout(() => {
                setPopup({...popup, opacity: '0', display: 'none'})
            }, 2000);
        }
    }

    const getParticipants = async () => {
        const participants = eventData.participants
        const arr = []

        participants.forEach((participant) => {
            usersRef.where('uid', '==', participant).get().then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    arr.push(doc.data())
                })  
            })
        })
        setParticipants(arr)
    }

    const handleJoin = async () => {
        const eventDoc = firestore.collection('events').doc(eventID);

        userDoc.update({
            joins: firebase.firestore.FieldValue.arrayUnion(eventID)
        }).then(() => {
            eventDoc.update({
                participants: firebase.firestore.FieldValue.arrayUnion(user.uid)
            }).then(() => {
                setPopup({...popup,opacity: '100', display: 'block', message: 'Ekinliğe katıldın'})
                setTimeout(() => {
                    setPopup({...popup, opacity: '0', display: 'none'})
                }, 2000);
                isJoined(true)
            })
        }).catch(() => {
            setPopup({...popup,opacity: '100', display: 'block', message: 'Bir hatadan dolayı etkinliğe katılamadın'})
            setTimeout(() => {
                setPopup({...popup, opacity: '0', display: 'none'})
            }, 2000);
            isJoined(false)
        })
    }

    const handleSave = async () => {
        
        if (!isSaved) {
            userDoc.update({
                saves: firebase.firestore.FieldValue.arrayUnion(eventID)
            }).then(() => {
                setPopup({...popup,opacity: '100', display: 'block', message: 'Ekinlik kaydedildi'})
                setTimeout(() => {
                    setPopup({...popup, opacity: '0', display: 'none'})
                }, 2000);
            }).catch((error) => {
                setPopup({...popup,opacity: '100', display: 'block', message: 'Ekinlik bir nedenden dolayı kaydedilemiyor: ' + error })
                setTimeout(() => {
                    setPopup({...popup, opacity: '0', display: 'none'})
                }, 2000);
            })
            setIsSaved(true)
        } else {
            userDoc.update({
                saves: firebase.firestore.FieldValue.arrayRemove(eventID)
            })
            setIsSaved(false)
        }
    }

    if (!loading) {
        return (
            <div className="w-full flex gap-10 p-10 max-lg:p-4 max-lg:gap-4 bg-main_light border border-main_light_dark dark:bg-dark rounded-2xl max-sm:border-none ">
                <div className="w-full flex flex-col gap-10 max-lg:gap-4">
                    <div className="flex flex-col gap-10">
                        <div className="py-4 dark:bg-main_text border border-main_text rounded-xl">
                            <h1 className="text-4xl max-xl:text-3xl max-md:text-2xl max-sm:text-lg text-center font-semibold">{eventData.title}</h1>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <img className="aspect-video max-h-[550px] rounded-xl object-cover" src={eventData.photoURL} />
                        <div>
                            <h3 className="text-2xl max-lg:text-xl font-semibold">Açıklama</h3>
                            <p className="text-xl max-lg:text-base max-sm:text-sm font-light">{eventData.description}</p>
                        </div>
                        <div>
                            <h3 className="text-2xl max-lg:text-xl font-semibold">Etkinliğin Yapılacağı Yer</h3>
                            <p className="text-xl max-lg:text-base max-sm:text-sm font-light">{eventData.eventLocation.address}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h4 className="text-xl max-lg:text-lg font-semibold">Katılımcılar</h4>
                            {eventData.participants.length == 0 ? <span className="max-lg:text-sm">Etkinliğin henüz bir katılımcısı yok</span>
                            : 
                                <div className="flex flex-wrap gap-3">
                                    {participants && participants.map((user) => (
                                        <div className="w-fit flex flex-col items-center gap-3 p-4 max-lg:p-3 border border-main_text bg-white dark:bg-main_text rounded-xl">
                                            <img className="w-20 h-20 rounded max-lg:w-16 max-lg:h-16 object-cover" src={user.photoURL} />
                                            <p className="max-lg:text-sm">{user.user_name}</p>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h4 className="text-xl max-lg:text-lg font-semibold">Kullanıcının Diğer Etkinlikleri</h4>
                            <div className='w-full grid gap-3 grid-cols-2 max-md:flex max-md:flex-col max-md:w-9/12'>
                                {usersOtherEvents && usersOtherEvents.map((event) => (
                                    event.id != eventData.eventID && <Event key={event.id} content={event} page={'eventPage'} />
                                ))}
                            </div>
                    </div>
                </div>
                <div className="w-3/12 flex flex-col gap-6">
                    <Link to={`/${creator.username}`} className="flex flex-col items-center gap-3 h-fit p-6 max-sm:p-2 border border-main_text rounded-xl">
                        {creator.photoURL && <img className="max-h-[200px] aspect-square object-cover rounded-lg" src={creator.photoURL} alt="Creator" />}
                        <span className="text-main_light_gray max-sm:text-xs">Etkinliği Düzenleyen</span>
                        <p className="text-xl max-md:text-lg max-sm:text-base">@{creator.username}</p>
                    </Link>
                    {creator.id != user?.uid && 
                    <div className="flex flex-col gap-6">
                        <button type="button" onClick={handleJoin} disabled={isJoined} className="p-6 max-sm:p-2 max-sm:text-center max-sm:text-sm w-full text-xl max-lg:text-base font-semibold bg-white border border-main_light_dark rounded-xl dark:bg-main_text dark:disabled:bg-main_light_dark dark:disabled:border-main_light_gray dark:disabled:hover:text-main_light outline-none disabled:bg-main_light_gray disabled:hover:text-main_text disabled:hover:border-main_text hover:text-main_dark_orange hover:border-main_dark_orange dark:hover:bg-main_text anim-500">{isJoined ? 'Etkinliğe Katıldın' : 'Etkinliğe Katıl'}</button>
                        <button type="button" onClick={handleSave} className="p-4 max-sm:p-2 w-fit border border-main_text rounded-2xl anim-500">{isSaved ? <MdOutlineFavorite className="text-main_text dark:text-main_light text-2xl max-sm:text-lg" /> : <MdOutlineFavoriteBorder className="text-main_text dark:text-main_light text-2xl max-sm:text-lg" />}</button>
                    </div>
                    }
                </div>
                <div className={`fixed top-10 opacity-${popup.opacity} mx-auto max-sm:px-4 max-sm:py-2 px-16 py-4 dark:bg-main_text bg-main_text border dark:border-main_dark_orange max-sm:text-sm text-xl font-necto_mono text-white rounded-xl anim-500`}>
                    {popup.message}
                </div>
            </div>
        )
    }
}