import { uploadPhoto } from '../utils/firebase'
import { firestore } from '../utils/firebase'
import { useState, useEffect } from 'react';

export default function EditEvent(props) {
    const [ popup, setPopup ] = useState({
        opacity: '0',
        display: 'none', 
        message: '',
    })
    const [ dateError, setDateError ] = useState('')
    const [ topics, setTopics ] = useState();
    const { data, setData } = props.data
    const { edit, setEdit } = props.edit

    useEffect(() => {
        getTopicNames()
        console.log(data)
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
        if (e.target.value == '') e.target.style.borderColor = '#f04040'
        else e.target.style.borderColor = '#454545'
        setData({...data, [e.target.name]: e.target.value})
    }

    const handleSubmit = () => {
        const eventRef = firestore.collection('events').doc(data.eventID)
        eventRef.update(data).then(() => {
            setPopup({...popup,opacity: '100', display: 'block', message: 'Etkinlik güncellendi'})
            setTimeout(() => {
                setPopup({...popup, opacity: '0', display: 'none'})
            }, 2000);
        }).catch((error) => {
            setPopup({...popup,opacity: '100', display: 'block', message: 'Etkinliğin bir hatadan dolayı güncellenemedi'})
            setTimeout(() => {
                setPopup({...popup, opacity: '0', display: 'none'})
            }, 2000);
        }).finally(() => {
            setEdit(false)
        })
    }

    const handleDelete = () => {
        const eventRef = firestore.collection('events').doc(data.eventID)
        eventRef.delete().then(() => {
            setPopup({...popup,opacity: '100', display: 'block', message: 'Etkinliğin silindi'})
            setEdit(false)
            setTimeout(() => {
                setPopup({...popup, opacity: '0', display: 'none'})
            }, 2000);
        })
    }

    const handleEventImage = async (e) => {
        if (e.target.files[0].size < 3145728) {
            await uploadPhoto(user.uid, e.target.files[0], `users/${user.uid}/profilePhoto.jpg`)
            .catch(() => {
                console.error('Profil resmi yükleme hatası:', error);
            })
        } 
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
    
    return (
        <form className='relative h-fit flex flex-col gap-6 p-4 dark:bg-main_text bg-main_light border-2 border-main_light_gray dark:border-main_light_dark rounded-2xl shadow-lg'>
            <div className='w-full flex gap-6'>
                <button onClick={() => handleSubmit()} type='button' className='w-full p-2 border dark:border-main_light_dark border-main_light_gray dark:text-white shadow-lg rounded-full hover:-translate-y-0.5 anim-500'>Kaydet</button>
                <button onClick={() => handleDelete()} type='button' className='w-full p-2 border dark:border-main_light_dark border-main_light_gray dark:text-white shadow-lg rounded-full hover:-translate-y-0.5 anim-500'>Sil</button>
            </div>
            <div className="flex flex-col gap-6 text-main_dark dark:text-main_light">
                <label className='rounded-xl border dark:border-main_light_gray shadow-lg cursor-pointer'>
                    {data.photoURL != null ? <img className='w-full h-72 rounded-xl border object-cover' src={data.photoURL} alt="event_photo" /> : <div className='w-80 rounded-full border dark:border-main_light_gray flex items-center justify-center shadow-lg'><BsPlus className='text-4xl text-main_light_gray' /></div>}
                    <input onChange={(e) => {handleInput(e); handleEventImage(e)}} className="hidden" type="file" accept="image/*" name="photoURL"/>
                </label>
                <div className="w-full flex flex-col gap-10">
                    <div className="flex flex-col gap-3">
                        <input onChange={(e) => handleInput(e)} onBlur={(e) => handleInput(e)} value={data.title} name='title' className='px-4 py-2 font-semibold text-xl bg-transparent border border-main_text dark:border-main_light_dark rounded-lg outline-none' type="text" />
                        <textarea onChange={(e) => handleInput(e)} onBlur={(e) => handleInput(e)} value={data.description} name='description' className='w-full max-h-32 px-4 py-2 text-sm bg-transparent border border-main_text dark:border-main_light_dark rounded-lg outline-none' type="text"  />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h5 className="text-xl font-semibold">Kategori</h5>
                        <div className='flex justify-between'>
                        <select value={data.category} onChange={(e) => handleInput(e)} className='px-4 py-2 font-semibold text-xl dark:bg-main_text bg-main_light border border-main_text dark:border-main_light_dark rounded-lg outline-none' name="category">
                                {topics && topics.map((topic) => (
                                    <option key={topic} value={topic}>{topic}</option>
                                ))}
                            </select>
                            <label className="w-[48%] flex flex-col relative">
                                <input onBlur={(e) => handleInput(e)} onChange={(e) => {handleDate(e); handleInput(e)}} value={data.startsAt} name='startsAt' className='px-4 py-2 font-semibold text-sm bg-transparent border border-main_light_gray rounded-lg outline-none anim-500 peer cursor-pointer' type="date" />
                                <span className="absolute bottom-10 text-sm px-3 py-1 bg-main_text text-main_light_gray border opacity-0 peer-focus:opacity-100 peer-focus:-translate-y-4 dark:hover:bg-main_text anim-500" style={dateError ? {color: '#f04040', opacity: '1'} : {}}>{dateError ? dateError : 'Etkinliğin Yapılacağı Tarih'}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={`fixed top-10 opacity-${popup.opacity} mx-auto max-sm:px-4 max-sm:py-2 px-16 py-4 dark:bg-main_text bg-main_text border dark:border-main_dark_orange max-sm:text-sm text-xl font-necto_mono text-white rounded-xl anim-500`}>
                {popup.message}
            </div>
        </form>
    )
}