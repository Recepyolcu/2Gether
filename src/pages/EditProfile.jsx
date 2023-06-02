import { useState, useEffect } from "react"
import { useUser } from "../utils/firestoreUserContext"
import { firestore, userNameAvailable, uploadPhoto } from "../utils/firebase"
import { BsPlus } from 'react-icons/bs'
import { getGeolocation } from "../utils/geolocation"

export default function EditProfile() {
    const { user, loading } = useUser()
    const [ topics, setTopics ] = useState()
    const [ topicsLoading, setTopicsLoading ] = useState(true)
    const [ popup, setPopup ] = useState({
        opacity: '0',
        display: 'none',
        message: ''
    })
    const [ available, setAvailable ] = useState(true)
    const [ usernameError, setUsernameError ] = useState('')
    const [ data, setData ] = useState({
        bio: user?.bio || '',
        photoURL: user?.photoURL || '',
        user_name: user?.user_name || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        gender: user?.gender || '',
        interests: user?.interests || [],
        user_location: {
            address: user?.user_location?.address || '',
            latitude: user?.user_location?.latitude || 0,
            longitude: user?.user_location?.longitude || 0,
        },
    })

    useEffect(() => {
        getTopics()
    }, [user])


    const getTopics = async () => {
        const topics = await firestore.collection('topics').get().then((snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            return data
        }).finally(() => {
            setTopicsLoading(false)
        })
        setTopics({ ...topics, topics })
    } 

    const handleSave = (e) => {
        e.preventDefault()
        if(available) {
            const userRef = firestore.collection('users').doc(user.uid)
            userRef.update(data).then(() => {
                setPopup({...popup,opacity: '100', display: 'block', message: 'Profilin Güncellendi!'})
                setTimeout(() => {
                    setPopup({...popup, opacity: '0', display: 'none'})
                }, 2000);
            }).catch(() => {
                setPopup({...popup,opacity: '100', display: 'block', message: 'Profilin Bir Hatadan Dolayı Güncellenemedi'})
                setTimeout(() => {
                    setPopup({...popup, opacity: '0', display: 'none'})
                }, 2000);
            })
        }
    }

    const handleProfileImage = async (e) => {
        if (e.target.files[0].size < 3145728) {
            const url = await uploadPhoto(user.uid, e.target.files[0], `users/${user.uid}/profilePhoto.jpg`).then(() => {
                console.log('Profil resmi başarıyla yüklendi ve Firestore kaydedildi.');
            }).catch(() => {
                console.error('Profil resmi yükleme hatası:', error);
            })
            setData({...data, [e.target.name]: url})
        } 
    }

    const handleInput = (e) => {
        if (e.target.value == '') e.target.style.borderColor = '#801010'
        else e.target.style.borderColor = '#454545'

        if (e.target.name == 'user_location') {
            getGeolocation(e.target.value)
            .then(result => {
                setData(prevData => ({
                    ...prevData,
                    user_location: {
                        address: result.formattedAddress,
                        latitude: result.latitude,
                        longitude: result.longitude
                    }
                }));
                console.log(data.user_location)
            })
            .catch(error => {
                console.log('Geolocation error:', error);
            });
        } else {
            setData({ ...data, [e.target.name]: e.target.value})
        }
    }

    const handleUserName = (e) => {
        const regex = /^\s*$/;
        if (regex.test(e.target.value)) {
            setUsernameError('Kullanıcı adını boşluk olmadan gir')
        } else {
            setUsernameError('')
        }
        userNameAvailable(e.target.value, user.uid).then((available) => {
            if(!available) {
                setAvailable(false)
                if (!usernameError) {
                    setUsernameError('Kullanıcı adı kullanılıyor')
                }
            } else {
                setAvailable(true)
                setData({...data, [e.target.name]: e.target.value})
            }
        })
    }

    const handleAddInterest = (interest) => {
        setData((prevData) => ({
          ...prevData,
          interests: [...prevData.interests, interest],
        }));
      };
      
      const handleRemoveInterest = (interest) => {
        setData((prevData) => ({
          ...prevData,
          interests: prevData.interests.filter((item) => item !== interest),
        }));
      };
    
    
    if(!loading && !topicsLoading) {
        return (
            <div className='w-full flex flex-col items-center gap-10 bg-main_light dark:bg-dark rounded-xl p-6 border border-main_light_dark'>
                <h1 className='text-2xl font-semibold'>Profili Düzenle</h1>
                <form className="w-9/12 max-xl:w-11/12 flex flex-col gap-6">
                    <div className="flex max-sm:flex-col max-sm:items-start gap-6 items-center">
                        <label className='max-md:h-20 max-md:w-20 w-28 h-28 rounded-full justify-center shadow-lg cursor-pointer'>
                            {user?.photoURL ? <img className="rounded-full w-full h-full border shadow-lg object-cover" src={user.photoURL} alt="user_profile_photo" /> : <div className='w-full h-full rounded-full border dark:border-main_light_gray flex items-center justify-center shadow-lg'><BsPlus className='text-4xl max-md:text-3xl text-main_light_gray' /></div>}
                            <input onChange={(e) => handleProfileImage(e)} className="hidden" type="file" accept="image/*" name="photoURL"/>
                        </label>
                        <div className='relative max-sm:w-full flex flex-col gap-3'>
                            <span className='font-semibold'>Kullanıcı Adı</span>
                            {usernameError && <span className="text-sm text-main_error">{usernameError}</span>}
                            <input onChange={(e) => {handleInput(e); handleUserName(e)}} type="text" name="user_name" value={data.user_name} className='w-full p-3 px-6 rounded-lg border-main_text outline-none dark:bg-dark border dark:border-main_light_dark dark:hover:border-main_light_gray dark:focus:border-main_light_gray dark:autofill:shadow-[0_0_0px_1000px_#171717_inset] dark:autofill:focus:shadow-[0_0_0_1000px_#252525_inset] focus:pl-[30px] anim-500' style={!usernameError ? {} : {borderColor: '#f04040'}}/>
                        </div>
                    </div>
                    <label className='flex flex-col gap-3'>
                        <span className='font-semibold'>Bio</span>
                        <textarea onChange={(e) => handleInput(e)} type="text" name="bio" value={data.bio} className='p-3 px-6 rounded-lg border-main_text outline-none dark:bg-dark border dark:border-main_light_dark dark:hover:border-main_light_gray dark:focus:border-main_light_gray dark:autofill:shadow-[0_0_0px_1000px_#171717_inset] dark:autofill:focus:shadow-[0_0_0_1000px_#252525_inset] focus:pl-[30px] anim-500'/>
                    </label>
                    <label className='flex flex-col gap-3'>
                        <span className='font-semibold'>Email</span>
                        <input onChange={(e) => handleInput(e)} type="text" name="email" value={data.email} className='p-3 px-6 rounded-lg border-main_text outline-none dark:bg-dark border dark:border-main_light_dark dark:hover:border-main_light_gray dark:focus:border-main_light_gray dark:autofill:shadow-[0_0_0px_1000px_#171717_inset] dark:autofill:focus:shadow-[0_0_0_1000px_#252525_inset] focus:pl-[30px] anim-500'/>
                    </label>
                    <label>
                        {data.user_location.address && <span className='text-main_light_gray'>{data.user_location.address}</span>}
                        <input name='user_location' onBlur={(e) => handleInput(e)} onChange={(e) => handleInput(e)} required className='p-4 px-6 rounded-lg outline-none dark:bg-dark border dark:border-main_light_dark dark:hover:border-main_light_gray dark:focus:border-main_light_gray autofill:shadow-[0_0_0px_1000px_#171717_inset] dark:autofill:shadow-[0_0_0px_1000px_#171717_inset] autofill:focus:shadow-[0_0_0_1000px_#252525_inset] dark:autofill:focus:shadow-[0_0_0_1000px_#252525_inset] focus:pl-[30px] anim-500 w-full' type="text" placeholder='Konum' />
                        <span className='text-main_light_gray'>Sana yakın etkinlikleri gösterebilmemiz için bir konum seç</span>
                    </label>
                    <label className='flex flex-col gap-3'>
                        <span className='font-semibold'>Cinsiyet</span>
                        <select onChange={(e) => handleInput(e)} type="text" name="gender" value={data.gender} className='p-3 px-6 rounded-lg border-main_text outline-none dark:bg-dark border dark:border-main_light_dark dark:hover:border-main_light_gray dark:focus:border-main_light_gray dark:autofill:shadow-[0_0_0px_1000px_#171717_inset] dark:autofill:focus:shadow-[0_0_0_1000px_#252525_inset] focus:pl-[30px] anim-500'>
                            <option>Erkek</option>
                            <option>Kadın</option>
                            <option>-</option>
                        </select>
                    </label>
                    <label className='flex flex-col gap-3'>
                        <span className='font-semibold'>Telefon Numarası</span>
                        <input onChange={(e) => handleInput(e)} type="text" name="phone_number" value={data.phone_number} className='p-3 px-6 rounded-lg border-main_text outline-none dark:bg-dark border dark:border-main_light_dark dark:hover:border-main_light_gray dark:focus:border-main_light_gray dark:autofill:shadow-[0_0_0px_1000px_#171717_inset] dark:autofill:focus:shadow-[0_0_0_1000px_#252525_inset] focus:pl-[30px] anim-500'/>
                    </label>
                    <div className='flex flex-col gap-2'>
                        <h1 className="text-2xl">İlgi alanlarını seç</h1>
                        <p className="text-main_light_gray">Seçtiğin alanlara göre etkinlikler karşına çıksın</p>
                    </div>
                    <div className='h-[360px] grid grid-cols-3 max-sm:grid-cols-2 gap-3 overflow-y-scroll'>
                        {Object.entries(topics).map((topic) => (
                            <label key={topic[1].id} className='flex flex-col items-center'>
                                <input onChange={(e) => e.target.checked ? handleAddInterest(e.target.value) : handleRemoveInterest(e.target.value)} className="hidden" type="checkbox" name="interests" checked={data.interests.includes(topic[1].name)} value={topic[1].name} />
                                <img className='rounded-xl max-h-36 border border-main_text hover:blur-none anim-500' style={data.interests.includes(topic[1].name) ? {borderColor: 'orange', opacity: '0.8'} : {opacity: '1'}} src={topic[1].photoURL} />
                                <h4 className='text-main_text dark:text-main_light'>{topic[1].name}</h4>
                            </label>
                        ))}
                    </div>
                </form>
                <button type="button" onClick={(e) => handleSave(e)} className="w-9/12 py-3 border dark:border-main_light_dark border-main_text rounded-lg shadow-xl hover:border-main_dark_orange dark:hover:border-main_dark_orange anim-500">Kaydet</button>
                <div className={`fixed top-10 opacity-${popup.opacity} mx-auto max-sm:px-4 max-sm:py-2 px-16 py-4 dark:bg-main_text bg-main_text border dark:border-main_dark_orange max-sm:text-sm text-xl font-necto_mono text-white rounded-xl anim-500`}>
                    {popup.message}
                </div>
            </div>
        )
    }  

}