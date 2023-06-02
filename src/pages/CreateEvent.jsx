import { useEffect, useState } from "react"
import { BsPlus } from 'react-icons/bs' 
import { firestore } from '../utils/firebase'
import { uploadPhoto } from "../utils/firebase"
import { useUser } from "../utils/firestoreUserContext"
import firebase from "firebase/compat/app"
import { getGeolocation } from "../utils/geolocation"
import { BiDownArrow } from 'react-icons/bi'


export default function CreateEvent() {
    const [ imgError, setImgError ] = useState('')
    const [ dateError, setDateError ] = useState('')
    const [ topics, setTopics ] = useState();
    const [ isEnter, setIsEnter ] = useState(false)
    const [ popup, setPopup ] = useState({
        opacity: '0',
        display: 'none', 
        message: ''
    })
    const { user } = useUser()
    const [ data, setData ] = useState({
        creatorID: user?.uid,
        eventID: '',
        title: '',
        description: '',
        photoURL: '',
        createdAt: '',
        startsAt: '',
        category: '',
        isActive: false,
        eventLocation: {
            address: '',
            latitude: '',
            longitude: '',
        },
        comments: [],
        likes: 0,
        participants: [],
        saves: 0,
    })

    function validateForm() {
        const inputs = document.querySelectorAll('input')
        let inputsValid = true
        inputs.forEach((inp) => {
            if(inp.value == '') {
                inputsValid = false
            }
        })
        return inputsValid
    } 

    useEffect(() => {
        getTopicNames()
    }, [])

    const getTopicNames = () => {
        const topicNames = [];
        firestore.collection('topics').get()
        .then((value) => {
            value.docs.forEach((doc) => {
                topicNames.push(doc.data().name)
            })
            setTopics(topicNames)
        }).finally(() => {
            return topicNames
        })
    }
    
    function handleInput(e) {
        if (e.target.value == '') e.target.style.borderColor = '#801010'
        else e.target.style.borderColor = '#454545'

        if (e.target.name == 'eventLocation') {
            getGeolocation(e.target.value)
            .then(result => {
                setData(prevData => ({
                    ...prevData,
                    eventLocation: {
                        address: result.formattedAddress,
                        latitude: result.latitude,
                        longitude: result.longitude
                    }
                }));
            })
            .catch(error => {
                console.log('Geolocation error:', error);
            });
        } else {
            setData({ ...data, [e.target.name]: e.target.value})
        }
    }
    
    const createEvent = async () => {
        if (validateForm()) {
            const eventRef = firestore.collection('events').doc();
            
            await eventRef.set({ ...data }).then(() => {
                setPopup({...popup,opacity: '100', display: 'block', message: 'Ekinliğin oluşturuldu! Profilinde etkinliğini görebilirsin'})
                setTimeout(() => {
                    setPopup({...popup, opacity: '0', display: 'none'})
                }, 2000);
            }).catch(() => {
                setPopup({...popup,opacity: '100', display: 'block', message: 'Etkinliğin oluşturulamadı'})
                setTimeout(() => {
                    setPopup({...popup, opacity: '0', display: 'none'})
                }, 2000);
            })

            eventRef.set({
                eventID: firestore.collection('events').doc(eventRef.id).id, 
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            },{
                mergeFields: ['eventID', 'createdAt']
            })
        } else {
            setPopup({...popup,opacity: '100', display: 'block'})
            setTimeout(() => {
                setPopup({...popup, opacity: '0', display: 'none', message: 'Lütfen etkinliğinde boş alan bırakma'})
            }, 2000);
        }
    }

    async function uploadToStore(image) {
        const refId = firestore.collection('events').doc().id
        const url = await uploadPhoto(refId, image, `events/${refId}/eventImage.jpg`)
        setData({...data, photoURL: url})
    }

    function handleDate(e) {
        const date = new Date(e.target.value)
        const currentDate = Date.now()
        if(date < currentDate) {
            setDateError('Etkinlik geçmiş zamanda oluşturulamaz')
        } else {
            setDateError('')
        }
    }
    
    async function handleImage(file)  {
        if (file.size < 3145728) {
            var reader = new FileReader();
            reader.onloadend = function (event) {
                const blob = new Blob([reader.result], {type: file.type})
                uploadToStore(blob)
            };
            reader.readAsArrayBuffer(file);
            setImgError('')
        } else {
            setImgError("Resim boyutu 3MB'dan küçük olmalı")
        }
    }

    function handleDragOver(e) {
        e.preventDefault()
        setIsEnter(true)
    }

    function handleDrop(e) {
        e.preventDefault()
        setIsEnter(false)
        handleImage(e.dataTransfer.files[0])
    }

    const hitComponent = ({ hit }) => {
        return (
            <button key={hit.id}>
                {hit.name}
            </button>
        )
    }

    return (
        <main className="relative bg-main_light dark:bg-dark sm:rounded-2xl sm:p-10 w-full h-full flex flex-col items-center justify-center">
                    <form className="sm:pt-20 w-9/12 max-lg:w-full h-fit flex flex-col items-center sm:border dark:border-main_light_gray border-main_text rounded-xl overflow-hidden">
                        <div className="flex flex-col gap-10 mb-10 items-center relative">
                            <h1 className="text-6xl max-xl:text-4xl max-lf:text-2xl font-semibold">Etkinliğini Oluştur</h1>
                            {imgError && <span className="absolute px-6 py-1 text-main_error anim-500">{imgError}</span>}
                            <label onDrop={(e) => handleDrop(e)} onDragOver={(e) => handleDragOver(e)} className="aspect-video max-md:w-10/12 max-lg: border border-main_text dark:border-main_light_gray rounded-xl flex items-center justify-center hover:border-main_dark_orange dark:hover:bg-main_text shadow-lg cursor-pointer anim-500 overflow-hidden peer" style={isEnter ? {backgroundColor: '#252525'} : imgError ? {borderColor: '#f01010'} : {}} >
                                {!data.photoURL && <span className="relative bottom-16 max-md:bottom-10 text-main_light_gray w-4/6 max-md:text-xs text-center">Resmini sürükleyip veya resim alanına tıklayıp ekleyebilirsin</span>}
                                {!data.photoURL && <BsPlus className="text-5xl max-md:text-3xl dark:text-main_light_gray text-dark absolute" />}
                                <img className="object-cover w-full h-full" style={data.photoURL != '' ? {display: 'block'} : {display: 'none'}} src={data.photoURL} alt="event_img" />
                                <input onChange={(e) => {handleImage(e.target.files[0]); handleInput(e)}} className="hidden" type="file" accept="image/*" name="image_entry"/>
                            </label>
                        </div>
                        <input onBlur={(e) => handleInput(e)} onChange={(e) => handleInput(e)} className="p-6 w-full text-xl bg-main_light placeholder:text-main_light_gray dark:bg-dark border-b-2 border-main_text dark:border-main_light_gray outline-none dark:focus:bg-main_text hover:bg-white dark:hover:bg-main_text anim-500" type="text" name="title" placeholder="Başlık" />
                        <input onBlur={(e) => handleInput(e)} onChange={(e) => handleInput(e)} className="p-6 w-full text-xl bg-main_light placeholder:text-main_light_gray dark:bg-dark border-b-2 border-main_text dark:border-main_light_gray outline-none dark:focus:bg-main_text hover:bg-white dark:hover:bg-main_text anim-500" type="text" name="description" placeholder="Açıklama"/>
                        <label className="relative w-full">
                            <select onChange={(e) => handleInput(e)} className="p-6 w-full text-xl bg-main_light placeholder:text-main_light_gray dark:bg-dark border-b-2 border-main_text dark:border-main_light_gray outline-none dark:focus:bg-main_text hover:bg-white dark:hover:bg-main_text anim-500" name="category">
                                {topics && topics.map((topic) => (
                                    <option key={topic} value={topic}>{topic}</option>
                                ))}
                            </select>
                            <BiDownArrow className="text-2xl absolute right-6 top-6"/>
                        </label>
                        <label className="w-full flex flex-col relative">
                            <input onChange={(e) => handleInput(e)} onBlur={(e) => {handleDate(e); handleInput(e)}} className="p-6 w-full text-xl bg-main_light text-main_light_gray placeholder:text-main_light_gray dark:bg-dark border-b-2 border-main_text dark:border-main_light_gray outline-none dark:focus:bg-main_text hover:bg-white dark:hover:bg-main_text anim-500 peer" type="date" name="startsAt" />
                            <span className="absolute px-6 py-1 bg-main_text text-main_light_gray border opacity-0 peer-focus:opacity-100 peer-focus:-translate-y-4 dark:hover:bg-main_text anim-500" style={dateError ? {color: '#f04040', opacity: '1'} : {}}>{dateError ? dateError : 'Etkinliğin Yapılacağı Tarih'}</span>
                        </label>
                        <label className="w-full flex flex-col relative">
                            <input onChange={(e) => handleInput(e)} onBlur={(e) => {handleDate(e); handleInput(e)}} placeholder="Etkinliğin Yapılacağı Yer" className="p-6 w-full text-xl bg-main_light text-main_light_gray placeholder:text-main_light_gray dark:bg-dark border-b-2 border-main_text dark:border-main_light_gray outline-none dark:focus:bg-main_text hover:bg-white dark:hover:bg-main_text anim-500 peer" type="text" name="eventLocation" />
                            <span className="absolute px-6 py-1 bg-main_text text-main_light_gray border opacity-0 peer-focus:opacity-100 peer-focus:-translate-y-4 dark:hover:bg-main_text anim-500">{data.eventLocation.address}</span>
                        </label>
                        <button type="button" onClick={(e) => createEvent(e)} className="p-6 w-full text-xl bg-main_light  dark:bg-dark outline-none hover:text-main_dark_orange dark:hover:bg-main_text anim-500">Etkinlik Oluştur</button>
                    </form>
                <div className={`fixed top-10 opacity-${popup.opacity} mx-auto max-sm:px-4 max-sm:py-2 px-16 py-4 dark:bg-main_text bg-main_text border dark:border-main_dark_orange max-sm:text-sm text-xl font-necto_mono text-white rounded-xl anim-500`}>
                    {popup.message}
                </div>
        </main>
    )
}