import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// ─── Configure Google Sign-In (call once at app start) ─────────────────────
export const configureGoogleSignIn = () => {
  try {
    GoogleSignin.configure({
      webClientId:
        '490762910345-kv5p8hbrtpcnd7tvurt2u3r7uf07ge36.apps.googleusercontent.com',
      offlineAccess: false,
    });
  } catch (err) {
    console.warn('GoogleSignin.configure failed: Native module likely missing. Rebuild the app.', err);
  }
};

// ─── Helper: Ensure / create Firestore user doc ────────────────────────────
const ensureUserDoc = async (
  uid: string,
  email: string | null,
  displayName: string | null,
  photoURL: string | null,
) => {
  const ref = firestore().collection('users').doc(uid);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({
      username: displayName ?? email?.split('@')[0] ?? 'Grandmaster',
      email: email ?? '',
      photoURL: photoURL ?? '',
      elo: 1200,
      rank: 'Novice',
      wins: 0,
      losses: 0,
      draws: 0,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  }
};

// ─── Email / Password Sign-Up ───────────────────────────────────────────────
export const signUp = async (
  email: string,
  password: string,
  username: string,
) => {
  try {
    const credential = await auth().createUserWithEmailAndPassword(email, password);
    const { user } = credential;

    // Set display name on Firebase Auth profile
    await user.updateProfile({ displayName: username });

    // Create Firestore profile
    await firestore().collection('users').doc(user.uid).set({
      username,
      email,
      photoURL: '',
      elo: 1200,
      rank: 'Novice',
      wins: 0,
      losses: 0,
      draws: 0,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: mapFirebaseError(error) };
  }
};

// ─── Email / Password Login ─────────────────────────────────────────────────
export const login = async (email: string, password: string) => {
  try {
    const credential = await auth().signInWithEmailAndPassword(email, password);
    return { user: credential.user, error: null };
  } catch (error: any) {
    return { user: null, error: mapFirebaseError(error) };
  }
};

// ─── Google Sign-In ─────────────────────────────────────────────────────────
export const signInWithGoogle = async () => {
  try {
    // Make sure Google Play services are available on Android
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Get the Google user info + ID token
    const signInResult = await GoogleSignin.signIn();

    // Prefer idToken from new API shape; fall back to legacy path
    const idToken =
      (signInResult as any).data?.idToken ??
      (signInResult as any).idToken;

    if (!idToken) {
      return { user: null, error: 'No ID token returned from Google.' };
    }

    // Exchange for Firebase credential
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);
    const { user } = userCredential;

    // Create Firestore profile if first sign-in
    await ensureUserDoc(user.uid, user.email, user.displayName, user.photoURL);

    return { user, error: null };
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return { user: null, error: 'Sign-in was cancelled.' };
    }
    if (error.code === statusCodes.IN_PROGRESS) {
      return { user: null, error: 'Sign-in is already in progress.' };
    }
    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return { user: null, error: 'Google Play Services not available.' };
    }
    return { user: null, error: mapFirebaseError(error) };
  }
};

// ─── Password Reset ─────────────────────────────────────────────────────────
export const sendPasswordReset = async (email: string) => {
  try {
    await auth().sendPasswordResetEmail(email);
    return { error: null };
  } catch (error: any) {
    return { error: mapFirebaseError(error) };
  }
};

// ─── Sign Out ───────────────────────────────────────────────────────────────
export const logout = async () => {
  try {
    // Sign out of Google if that session was used (revokeAccess is safe to ignore if not signed in)
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (_) {
      // Not a Google session — ignore
    }
    await auth().signOut();
    return { error: null };
  } catch (error: any) {
    return { error: mapFirebaseError(error) };
  }
};

// ─── User Profile Listener ────────────────────────────────────────────────
export const getUserProfile = (uid: string, callback: (data: any) => void) => {
  return firestore()
    .collection('users')
    .doc(uid)
    .onSnapshot(
      (snapshot) => {
        if (snapshot.exists()) {
          callback({ id: snapshot.id, ...snapshot.data() });
        }
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
};

// ─── Leaderboard ──────────────────────────────────────────────────────────
export const getLeaderboard = async (limit: number = 20) => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .orderBy('elo', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

// ─── Friends Management ───────────────────────────────────────────────────
export const getFriends = (uid: string, callback: (friends: any[]) => void) => {
  return firestore()
    .collection('users')
    .doc(uid)
    .collection('friends')
    .onSnapshot((snap) => {
      callback(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
};

export const getFriendRequests = (uid: string, callback: (requests: any[]) => void) => {
  return firestore()
    .collection('users')
    .doc(uid)
    .collection('friendRequests')
    .where('status', '==', 'pending')
    .onSnapshot((snap) => {
      callback(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
};

export const sendFriendRequest = async (fromUid: string, fromName: string, toUid: string) => {
  try {
    const ref = firestore()
      .collection('users')
      .doc(toUid)
      .collection('friendRequests')
      .doc(fromUid);

    await ref.set({
      fromName,
      status: 'pending',
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const acceptFriendRequest = async (uid: string, friendUid: string, friendName: string, myName: string) => {
  try {
    const batch = firestore().batch();

    // 1. Mark request as accepted
    const reqRef = firestore().collection('users').doc(uid).collection('friendRequests').doc(friendUid);
    batch.update(reqRef, { status: 'accepted' });

    // 2. Add to my friends
    const myFriendRef = firestore().collection('users').doc(uid).collection('friends').doc(friendUid);
    batch.set(myFriendRef, { username: friendName, addedAt: firestore.FieldValue.serverTimestamp() });

    // 3. Add to their friends
    const theirFriendRef = firestore().collection('users').doc(friendUid).collection('friends').doc(uid);
    batch.set(theirFriendRef, { username: myName, addedAt: firestore.FieldValue.serverTimestamp() });

    await batch.commit();
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// ─── Helpers ────────────────────────────────────────────────────────────────
export const getCurrentUser = () => auth().currentUser;

/** Map Firebase error codes to user-friendly messages */
const mapFirebaseError = (error: any): string => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'That email address is already registered.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account found with that email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    default:
      return error.message ?? 'An unexpected error occurred.';
  }
};
