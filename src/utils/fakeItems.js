import { faker } from '@faker-js/faker/locale/tr';
import { firestore } from "../utils/firebase"
import firebase from "firebase/compat/app"
import { v4 as uuidv4 } from 'uuid'

export const fakeIt = () => {
    const eventRef = firestore.collection('events').doc()
    eventRef.set({
        category: faker.helpers.arrayElement(['Dans' , 'Müzik' , 'Teknoloji' , 'Sosyal Etkinlikler' , 'Oyunlar' , 'Gezi ve Seyahat' , 'Dil' , 'Kariyer' , 'Spor ve Fitness' , 'Sanat' , 'Sağlık' , 'Edebiyat' , 'Bilim' , 'Topluluk']),
        creatorID: uuidv4(),
        creatorUserName: faker.internet.displayName(),
        creatorPhotoURL: faker.image.avatar(),
        description: faker.hacker.phrase(),
        eventAddress: faker.location.city(),
        _geoloc: {
            lat: faker.location.latitude(),
            lng: faker.location.longitude()
        },
        likes: faker.number.int(100),
        participants: [uuidv4(), uuidv4(), uuidv4()],
        photoURL: faker.image.urlLoremFlickr({ category: 'city' }),
        saves: faker.number.int(40),
        startsAt: faker.date.between({ from: '2023-05-01T00:00:00.000Z', to: '2025-01-01T00:00:00.000Z' }).toISOString().split('T')[0],
        title: faker.lorem.words(2)
    }).then(() => {
        eventRef.set({
            eventID: firestore.collection('events').doc(eventRef.id).id, 
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        },{
            mergeFields: ['eventID', 'createdAt']
        })
    })

}

export const deleteCollection = () => {
    firestore.collection('events').get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            firestore.collection('events').doc(doc.id).delete()
        })
        console.log('events silindi')
    })
}