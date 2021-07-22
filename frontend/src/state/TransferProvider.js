import React, { createContext, useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app';
import { FirebaseContext } from './FirebaseProvider';

export const TransferContext = createContext();

export const TransferProvider = props => {
    const [transferDoc, setTransferDoc] = useState(null);

    const [firebaseState] = useContext(FirebaseContext);
    const { authUser } = firebaseState;

    // Setup userDoc listener
    useEffect(() => {
        if (!transferDoc && authUser && authUser.uid) {

            const db = firebase.firestore.client();
            var docRef = db.collection("users").doc(authUser.uid);

            
            const unsubscribe = docRef.get().then((doc) => {
                if (doc.exists) {
                    let userDoc = doc.data();
                    setTransferDoc(userDoc);
                    console.log("User doc data:", userDoc);
                } else {
                    // doc.data() will be undefined in this case
                    console.log("Create user doc!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });

            return () => {
                unsubscribe();
            }
        }
        
    }, [authUser, transferDoc]);

    return (
        <TransferContext.Provider value={authUser}>
            {props.children}
        </TransferContext.Provider>
    );
};