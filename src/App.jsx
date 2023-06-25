import { Route, Routes, useParams } from 'react-router-dom'
import Main from './pages/Main'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import CreateEvent from './pages/CreateEvent'
import './App.css'
import { Navigate } from 'react-router-dom'
import RootLayout from './RootLayout'
import UserPage from './pages/UserPage'
import { useUser } from './utils/firestoreUserContext'
import { useEffect, useState } from 'react'
import { auth, getUserWithUserName } from './utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import EditProfile from './pages/EditProfile'
import MessagesPage from './pages/MessagesPage'
import EventPage from './pages/EventPage'

function App() {
    const { user, loading } = useUser()
    
    const ProtectedRoute = ({ children }) => {
        const [ user, loading ] = useAuthState(auth)
        if (!user) {
            return <Navigate to="/" replace />;
        }
        return children;
    };

    const UserRoute = () => {
        const [ user, setUser ] = useState(null)
        const [ loading, setLoading ] = useState(true)
        const username = useParams().user_name

        useEffect(() => {
            getUserWithUserName(username).then((user) => {
                setUser(user)
                setLoading(false)
            })
        }, []);

        if(!loading) {
            if (user === null) { 
                return (
                    <div className='w-full p-6 pt-20 dark:bg-dark bg-main_light border dark:border-main_light_dark border-main_text dark:text-main_light text-main_text rounded-2xl'>
                        <h1 className='text-2xl text-center font-bold'>Kullanıcı Bulunamadı</h1>
                    </div>
                )
            } else {
                return <UserPage user={user} />
            }
        }
    }
    
    if(!loading) {
        return (
            <RootLayout>
                    <Routes>
                        <Route path='/' element={!loading && !user ? <Main /> : <Home />} />
                        <Route path='/login' element={<Login />} />

                        <Route path={`/${user?.user_name}`} element={
                            <ProtectedRoute children={<Profile />} />
                        } />
                        <Route path={`/edit_profile`} element={
                            <ProtectedRoute children={<EditProfile />} />
                        } />
                        <Route path={`/messages`} element={
                            <ProtectedRoute children={<MessagesPage />} />
                        } />
                        <Route path={`/:user_name`} element={
                            <ProtectedRoute children={<UserRoute />} />
                        } />   
                        <Route path={`/events/:event_id`} element={
                            <ProtectedRoute children={<EventPage />} />
                        } />           
                        <Route path='/create_event' element={
                            <ProtectedRoute children={<CreateEvent />} />
                        } />
                    </Routes>
            </RootLayout>
        )
    }
}

export default App