// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAhP_2tl1MvwlgXeShB3MYV-xlYCIkYg9M',
    authDomain: 'chatbot-c28d8.firebaseapp.com',
    projectId: 'chatbot-c28d8',
    storageBucket: 'chatbot-c28d8.firebasestorage.app',
    messagingSenderId: '685219036338',
    appId: '1:685219036338:web:8d8a6633146223811b5dab',
    measurementId: 'G-S0MTL3ZQK3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export default database;
