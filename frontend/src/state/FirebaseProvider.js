import React, { createContext, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

export const FirebaseContext = createContext();

export const FirebaseProvider = props => {
    const [authUser, setAuthUser] = useState({});
    const categories = authUser.categories || [];
    const [userDoc, setUserDoc] = useState({});

    // Initialize (or retrieve current) firebaseui widget
    let ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());

    // Specify customizations and callbacks
    const uiConfig = {
        callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            const el = document.getElementById('loader')
            if (el) {
                el.style.display = 'none';
            }
        }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: '/home',
        signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
    };
  
    // Setup state listener
    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                getUserDoc(user);
                setAuthUser(user);
            } else {
                ui.start('#firebaseui-auth-container', uiConfig);
                setAuthUser(null);
            }
        });
        return () => {
            unsubscribe();
        }
    }, []);

    // Handle getting and/or creating userDoc
    const getUserDoc = (user) => {
        if (!user) return;
        const db = firebase.firestore();
        return db
            .collection('users')
            .doc(user.uid)
            .onSnapshot((doc) => {
                if (doc && doc.exists) {
                    const data = doc.data();
                    setUserDoc(data);
                } else {
                    generateUserDoc(user);
                    setUserDoc({
                        email: user.email,
                        displayName: user.displayName,
                        categories: [],
                    });
                }
        });
    };

    const createCategory = (newCategory) => {
        if (!authUser.uid) return;

        const newCategories = [newCategory, ...categories];

        const db = firebase.firestore();
        return db.collection('users/').doc(authUser.uid).set({
            displayName: authUser.displayName,
            email: authUser.email,
            categories: newCategories,
        });
    };

    const generateUserDoc = (user) => {
        if (!user) return;

        const { email, displayName } = user;
        const categories = user.categories || [];
        const db = firebase.firestore();
        return db.collection('users').doc(user.uid).set({
            displayName,
            email,
            categories,
        });
    };

    const signout = () => {
        firebase.auth().signOut().then(() => {
        // Sign-out successful.
            setAuthUser(null);
        }).catch((error) => {
        // An error happened.
        });
          
    };

    const state = {
        userDoc,
        authUser,
    };
    const dispatch = {
        signout,
        createCategory,
    }

    const vals = [state, dispatch];
    return (
        <FirebaseContext.Provider value={vals}>
            {props.children}
        </FirebaseContext.Provider>
    );
};