import { config, firestore } from "firebase-functions"
import algoliasearch from "algoliasearch"

const APP_ID = config().algolia.app
const ADMIN_KEY = config().algolia.key

const client = algoliasearch(APP_ID, ADMIN_KEY)
const indexTopics = client.initIndex("topics")
const indexEvents = client.initIndex("events")
const indexUsers = client.initIndex("users")

export const addToIndexTopics = firestore.document("topics/{topicID}")
    .onCreate(snapshot => {
        const data = snapshot.data();
        const objectID = snapshot.id;

        return indexTopics.addObject({ ...data, objectID });
    });

export const updateIndexTopics = firestore.document("topics/{topicID}")
    .onCreate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;

        return indexTopics.saveObject({ ...newData, objectID });
    });

export const deleteFromIndexTopics = firestore.document("topics/{topicID}")
    .onDelete(snapshot => indexTopics.deleteObject(snapshot.id));

export const addToIndexEvents = firestore.document("events/{eventID}")
    .onCreate(snapshot => {
        const data = snapshot.data();
        const objectID = snapshot.id;

        return indexEvents.addObject({ ...data, objectID });
    });

export const updateIndexEvents = firestore.document("events/{eventID}")
    .onCreate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;

        return indexEvents.saveObject({ ...newData, objectID });
    });

export const deleteFromIndexEvents = firestore.document("events/{eventID}")
    .onDelete(snapshot => indexEvents.deleteObject(snapshot.id));

export const addToIndexUsers = firestore.document("users/{userID}")
    .onCreate(snapshot => {
        const data = snapshot.data();
        const objectID = snapshot.id;

        return indexUsers.addObject({ ...data, objectID });
    });

export const updateIndexUsers = firestore.document("users/{userID}")
    .onCreate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;

        return indexUsers.saveObject({ ...newData, objectID });
    });

export const deleteFromIndexUsers = firestore.document("users/{userID}")
    .onDelete(snapshot => indexUsers.deleteObject(snapshot.id));