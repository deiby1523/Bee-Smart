// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDX10pZT1TGquhTMJ7wZ1OLtdo9LVn0tIA',
  authDomain: 'bee-smart-edc7f.firebaseapp.com',
  projectId: 'bee-smart-edc7f',
  storageBucket: 'bee-smart-edc7f.firebasestorage.app',
  messagingSenderId: '862016872538',
  appId: '1:862016872538:web:7310363f1bf8b6f83df863',
  measurementId: 'G-BYPHSPDWC7',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
