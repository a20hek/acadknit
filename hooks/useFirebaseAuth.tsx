import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword as signInWithEmailAndPassword_,
	signOut,
	GoogleAuthProvider,
	signInWithPopup,
	getAdditionalUserInfo,
} from 'firebase/auth';

import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

import { useEffect, useState } from 'react';

import cookie from 'js-cookie';
import { useRouter } from 'next/router';

interface User {
	uid: string;
	email: string;
	provider?: string;
	token?: string;
}

export const useFirebaseAuth = () => {
	const [authenticated, setAuthenticated] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const Router = useRouter();

	const handleUser = async (rawUser) => {
		if (rawUser) {
			const user = await formatUser(rawUser);
			const { token, ...userWithoutToken } = user;
			createUser(user.uid, userWithoutToken);
			setUser(user);
			cookie.set('acad-auth', true, {
				expires: 1,
			});

			setLoading(false);
			return user;
		} else {
			setUser(null);
			cookie.remove('acad-auth');

			setLoading(false);
			return false;
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user: User) => {
			if (user) {
				setAuthenticated(true);
				setUser(user);
			} else {
				setAuthenticated(false);
				setUser(null);
			}
		});
		return unsubscribe;
	}, []);

	const signUpWithEmailAndPassword = (email, password) => {
		return createUserWithEmailAndPassword(auth, email, password).then((response) => {
			handleUser(response.user);
			Router.push('/registration/1');
		});
	};

	const signInWithEmailAndPassword = (email, password) => {
		return signInWithEmailAndPassword_(auth, email, password).then((response) => {
			handleUser(response.user);
			Router.push('/home');
		});
	};

	const signInWithGoogle = () => {
		const googleProvider = new GoogleAuthProvider();
		return signInWithPopup(auth, googleProvider).then((response) => {
			handleUser(response.user);
			const additionalUserInfo = getAdditionalUserInfo(response);
			const isNewUser = additionalUserInfo.isNewUser;
			if (isNewUser) {
				Router.push('/registration/1');
			} else {
				Router.push('/home');
			}
		});
	};

	const logOut = () => {
		return signOut(auth)
			.then(() => {
				handleUser(null);
			})
			.then(() => Router.push('/'));
	};

	const [uid, setUid] = useState(undefined);
	auth.onAuthStateChanged((user) => setUid(user?.uid));

	return {
		authenticated,
		user,
		signUpWithEmailAndPassword,
		signInWithEmailAndPassword,
		signInWithGoogle,
		logOut,
		uid,
	};
};

export function createUser(uid, data) {
	const userRef = doc(db, 'users', uid);
	return setDoc(userRef, { uid, ...data }, { merge: true });
}

const formatUser = async (user) => {
	const token = await user.getIdToken();
	return {
		uid: user.uid,
		email: user.email,
		provider: user.providerData[0].providerId,
		token,
	};
};
