import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithCredential, 
  GoogleAuthProvider, 
  sendPasswordResetEmail, 
  signOut, 
  FirebaseAuthTypes 
} from '@react-native-firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  where, 
  writeBatch, 
  serverTimestamp,
  FieldValue 
} from '@react-native-firebase/firestore';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export const PROFILE_ICONS = [
  'Award', 'Trophy', 'Zap', 'Bot', 'Target', 'Star', 
  'Shield', 'Flame', 'Ghost', 'Sword', 'Crown', 'Lightbulb',
  'Cpu', 'Gamepad2', 'Music', 'Camera', 'Heart', 'Smile'
];

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
  const db = getFirestore();
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      username: displayName ?? email?.split('@')[0] ?? 'Grandmaster',
      email: email ?? '',
      photoURL: (!photoURL || photoURL.startsWith('http')) ? 'Award' : photoURL,
      elo: 1200,
      rank: 'Novice',
      wins: 0,
      losses: 0,
      draws: 0,
      createdAt: serverTimestamp(),
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
    const credential = await createUserWithEmailAndPassword(getAuth(), email, password);
    const { user } = credential;

    // Set display name on Firebase Auth profile
    await user.updateProfile({ displayName: username });

    // Create Firestore profile
    const db = getFirestore();
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      photoURL: '',
      elo: 1200,
      rank: 'Novice',
      wins: 0,
      losses: 0,
      draws: 0,
      createdAt: serverTimestamp(),
    });

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: mapFirebaseError(error) };
  }
};

// ─── Email / Password Login ─────────────────────────────────────────────────
export const login = async (email: string, password: string) => {
  try {
    const credential = await signInWithEmailAndPassword(getAuth(), email, password);
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
    const googleCredential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(getAuth(), googleCredential);
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

export const updateProfileIcon = async (uid: string, iconName: string) => {
  try {
    const db = getFirestore();
    await updateDoc(doc(db, 'users', uid), {
      photoURL: iconName,
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

const calculateRank = (elo: number) => {
  if (elo >= 2800) return 'Grandmaster';
  if (elo >= 2400) return 'Master';
  if (elo >= 2000) return 'Expert';
  if (elo >= 1600) return 'Intermediate';
  return 'Novice';
};

export const recordGameResult = async (uid: string, isWin: boolean, isDraw: boolean, eloChange: number) => {
  try {
    const db = getFirestore();
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return { error: 'User not found' };

    const data = snap.data();
    const newElo = Math.max(100, (data.elo || 1200) + eloChange);
    
    await updateDoc(userRef, {
      wins: (data.wins || 0) + (isWin ? 1 : 0),
      losses: (data.losses || 0) + (!isWin && !isDraw ? 1 : 0),
      draws: (data.draws || 0) + (isDraw ? 1 : 0),
      elo: newElo,
      rank: calculateRank(newElo)
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// ─── Password Reset ─────────────────────────────────────────────────────────
export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(getAuth(), email);
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
    await signOut(getAuth());
    return { error: null };
  } catch (error: any) {
    return { error: mapFirebaseError(error) };
  }
};

// ─── User Profile Listener ────────────────────────────────────────────────
export const getUserProfile = (uid: string, callback: (data: any) => void) => {
  const db = getFirestore();
  return onSnapshot(
    doc(db, 'users', uid),
    (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() });
      } else {
        // Document missing? Try creating it using the current sign-in data
        const user = getAuth().currentUser;
        if (user) {
          ensureUserDoc(user.uid, user.email, user.displayName, user.photoURL);
        }
        callback(null);
      }
    },
    (error) => {
      console.error('Error fetching user profile:', error);
    }
  );
};

// ─── Leaderboard ──────────────────────────────────────────────────────────
export const getLeaderboard = async (limitNum: number = 20) => {
  try {
    const db = getFirestore();
    const q = query(
      collection(db, 'users'),
      orderBy('elo', 'desc'),
      limit(limitNum)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

// ─── Friends Management ───────────────────────────────────────────────────
export const getFriends = (uid: string, callback: (friends: any[]) => void) => {
  const db = getFirestore();
  return onSnapshot(
    collection(db, 'users', uid, 'friends'),
    (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
  );
};

export const getFriendRequests = (uid: string, callback: (requests: any[]) => void) => {
  const db = getFirestore();
  const q = query(
    collection(db, 'users', uid, 'friendRequests'),
    where('status', '==', 'pending')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

export const sendFriendRequest = async (fromUid: string, fromName: string, toUid: string) => {
  try {
    const db = getFirestore();
    const ref = doc(db, 'users', toUid, 'friendRequests', fromUid);

    await setDoc(ref, {
      fromName,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const acceptFriendRequest = async (uid: string, friendUid: string, friendName: string, myName: string) => {
  try {
    const db = getFirestore();
    const batch = writeBatch(db);

    // 1. Mark request as accepted
    const reqRef = doc(db, 'users', uid, 'friendRequests', friendUid);
    batch.update(reqRef, { status: 'accepted' });

    // 2. Add to my friends
    const myFriendRef = doc(db, 'users', uid, 'friends', friendUid);
    batch.set(myFriendRef, { username: friendName, addedAt: serverTimestamp() });

    // 3. Add to their friends
    const theirFriendRef = doc(db, 'users', friendUid, 'friends', uid);
    batch.set(theirFriendRef, { username: myName, addedAt: serverTimestamp() });

    await batch.commit();
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// ─── Helpers ────────────────────────────────────────────────────────────────
export const getCurrentUser = () => getAuth().currentUser;

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
