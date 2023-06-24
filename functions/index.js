import { config, firestore } from "firebase-functions";
import algoliasearch from "algoliasearch";

const APP_ID = config().algolia.app;
const ADMIN_KEY = config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const topicsIndex = client.initIndex("topics");

export const addToIndex = firestore.document("topics/{topicID}")
    .onCreate(snapshot => {
        const data = snapshot.data();
        const objectID = snapshot.id;

        return topicsIndex.addObject({ ...data, objectID });
    });

export const updateIndex = firestore.document("topics/{topicID}")
    .onCreate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;

        return topicsIndex.saveObject({ ...newData, objectID });
    });

export const deleteFromIndex = firestore.document("topics/{topicID}")
    .onDelete(snapshot => topicsIndex.deleteObject(snapshot.id));


const eventsIndex = client.initIndex("events");
export const addToIndexEvents = firestore.document("events/{eventID}")
    .onCreate(snapshot => {
        const data = snapshot.data();
        const objectID = snapshot.id;

        return eventsIndex.addObject({ ...data, objectID });
    });

export const updateIndexEvents = firestore.document("events/{eventID}")
    .onCreate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;

        return eventsIndex.saveObject({ ...newData, objectID });
    });

export const deleteFromIndexEvents = firestore.document("events/{eventID}")
    .onDelete(snapshot => eventsIndex.deleteObject(snapshot.id));


const usersIndex = client.initIndex("users");
export const addToIndexUsers = firestore.document("users/{userID}")
    .onCreate(snapshot => {
      const data = snapshot.data();
      const objectID = snapshot.id;
  
      return usersIndex.addObject({ ...data, objectID });
    });
  
export const updateIndexUsers = firestore.document("users/{userID}")
    .onCreate((change) => {
      const newData = change.after.data();
      const objectID = change.after.id;
  
      return usersIndex.saveObject({ ...newData, objectID });
    });
  
export const deleteFromIndexUsers = firestore.document("users/{userID}")
    .onDelete(snapshot => usersIndex.deleteObject(snapshot.id));