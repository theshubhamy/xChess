import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const signUp = async (email: string, pass: string, username: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, pass);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    await firestore().collection('users').doc(user.uid).set({
      username,
      email,
      elo: 1200, // Initial ELO for all grandmaster candidates
      rank: 'Novice',
      wins: 0,
      losses: 0,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    
    return { user, error: null };
  } catch (error: any) {
    console.error('Sign Up Error:', error);
    return { user: null, error: error.message };
  }
};

export const login = async (email: string, pass: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, pass);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Login Error:', error);
    return { user: null, error: error.message };
  }
};

export const logout = async () => {
  try {
    await auth().signOut();
    return { error: null };
  } catch (error: any) {
    console.error('Logout Error:', error);
    return { error: error.message };
  }
};

export const getCurrentUser = () => auth().currentUser;
