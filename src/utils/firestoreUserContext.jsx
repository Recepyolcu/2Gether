import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from './firebase';

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    const authUser = useAuthState(auth);
    
    useEffect(() => {
        if (authUser[0]) {
            const uid = authUser[0].uid;
            const userRef = firestore.collection('users').doc(uid);
            const unsubscribe = userRef.onSnapshot((snapshot) => {
                if (snapshot.exists) {
                    const userData = snapshot.data();
                    setUser(userData);
                    setLoading(false)
                } else {
                    setUser(null);
                    setLoading(false)
                }
            }, (error) => {
                console.log('Firestore sorgusu hatası:', error);
                setUser(null);
                setLoading(false)
            })
            return () => {
                unsubscribe();
            }
        } else {
            setUser(null)
            setLoading(false)
        }
    }, [authUser[0]]);

    if (loading) {
        return <div>user Loading...</div>;
    }

    const userContextValue = {
        user, 
        loading
    }

    return (
        <UserContext.Provider value={userContextValue}>
            {children}
        </UserContext.Provider>
    );
};

function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useTheme hook must be used within a ThemeProvider');
    }

    return context;
}

export { UserProvider, useUser };
