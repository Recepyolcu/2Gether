import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import { uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const chatsRef = firestore.collection('chats')
const usersRef = firestore.collection('users')
const eventsRef = firestore.collection('events')

export const userData = async () => {
    const userDoc = usersRef.doc(auth.currentUser.uid);
    const userSnapshot = await userDoc.get();
    if (userSnapshot.exists) {
        return userSnapshot.data();
    } else {
        console.log('No such document!');
        return null;
    }
}

export const checkUserExists = async (userId) => {
    try {
      const userDoc = await usersRef.doc(userId).get();
      if (userDoc.exists) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Hata:', error);
    }
};

export const userNameAvailable = async (username, userId) => {
    try {
        const userDoc = usersRef.doc(userId)
        const userData = await userDoc.get()
        var prevUserName;
        if (userData.exists) {
            prevUserName = userData.data().user_name
        } else {
            prevUserName = '';
        }

        const query = usersRef.where('user_name', '==', username);
        return query.get().then((snapshot) => {
            if (snapshot.empty) {
                return true;
            } else {
                if (prevUserName === username) {
                    return true;
                }
                return false;
            }
        });
    } catch (error) {
        console.log(error)
    }
}

export const uploadPhoto = async (id, file, path) => {
    const storage = firebase.storage()
    const storageRef = storage.ref(path);
    try {
        await uploadBytes(storageRef, file, 'image/jpeg' || 'image/png').then(() => {
            console.log('resim storage a yüklendi')
        })
        const url = await getDownloadURL(storageRef);
        const photoDocRef = firestore.collection(path.split('/')[0]).doc(id);
        const doc = await photoDocRef.get();
        if (doc.exists) {
            await photoDocRef.update({ photoURL: url });
            console.log("Resim URL'si Firestore'a kaydedildi.");
        } 
    
        return url;
    } catch (error) {
        console.log("Resim URL'si kaydedilirken hata oluştu: ", error);
        return null;
    }
};

export const getUserEvents = async (userID) => {
    try {
        const query = eventsRef.where('creatorID', '==', userID);
        const snapshot = await query.get();
        const userEvents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        return userEvents;
    } catch (error) {
        console.log('Error fetching user events:', error);
        throw error;
    }
};

export const getUserWithUserName = async (username) => {
    const query = usersRef.where('user_name', '==', username);
  
    await query.get().then((snapshot) => {
        if (snapshot.empty) {
            return null;
        } else {
            const user = snapshot.docs[0].data();
            return user;
        }
    });
}

export const startChat = async (user, receiver) => {
    const combinedId = user.uid > receiver.uid ? user.uid + receiver.uid : receiver.uid + user.uid
    const userChatsRef = firestore.collection('userChats')
    const isUserDocExist = (await userChatsRef.doc(user.uid).get()).exists
    const isReceiverDocExist = (await userChatsRef.doc(receiver.uid).get()).exists
    try {
        await chatsRef.doc(combinedId).set({
            messages: []
        })
        if (isUserDocExist === false) {
            await userChatsRef.doc(user.uid).set({
                [combinedId]: {
                    userInfo: {
                        uid: receiver.uid,
                        username: receiver.user_name,
                        photoURL: receiver.photoURL,
                    },
                    date: firebase.firestore.FieldValue.serverTimestamp(),
                }
            })
        } else {
            await userChatsRef.doc(user.uid).update({
                [combinedId]: {
                    userInfo: {
                        uid: receiver.uid,
                        username: receiver.user_name,
                        photoURL: receiver.photoURL,
                    },
                    date: firebase.firestore.FieldValue.serverTimestamp(),
                }
            })
        }
        if (isReceiverDocExist === false) {
            await userChatsRef.doc(receiver.uid).set({
                [combinedId]: {
                    userInfo: {
                        uid: user.uid,
                        username: user.user_name,
                        photoURL: user.photoURL,
                    },
                    date: firebase.firestore.FieldValue.serverTimestamp(),
                }
            })
        } else {
            await userChatsRef.doc(receiver.uid).update({
                [combinedId]: {
                    userInfo: {
                        uid: user.uid,
                        username: user.user_name,
                        photoURL: user.photoURL,
                    },
                    date: firebase.firestore.FieldValue.serverTimestamp(),
                }
            })
        }
        console.log('chat created')
    } catch (error) {
        console.log(error)
    }
}

firebase.auth().onAuthStateChanged((user) => {
    if(user) {
        console.log(user)
    } else {
        console.log('logged out')
    }
})