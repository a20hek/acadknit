import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseApp = initializeApp({
	apiKey: 'AIzaSyCs5VDb5MON0GKGOqk4ZmLTKLkryrNfCsY',
	authDomain: 'acadknit.firebaseapp.com',
	projectId: 'acadknit',
	storageBucket: 'acadknit.appspot.com',
	messagingSenderId: '16876023707',
	appId: '517612940152',
});

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db, firebaseApp };
