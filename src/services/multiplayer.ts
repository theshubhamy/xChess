import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  where, 
  limit, 
  getDocs, 
  deleteDoc, 
  updateDoc,
  serverTimestamp,
  arrayUnion,
  getDoc,
  writeBatch,
  FieldValue,
  addDoc,
  orderBy
} from '@react-native-firebase/firestore';

export interface GameState {
  id?: string;
  players: {
    [uid: string]: {
      username: string;
      photoURL: string;
      elo: number;
      color: 'w' | 'b';
    }
  };
  playerUids: string[];
  fen: string;
  history: string[];
  status: 'active' | 'checkmate' | 'draw' | 'resigned';
  winner?: string;
  turn: 'w' | 'b';
  lastMoveAt: any;
  createdAt: any;
}

const db = getFirestore();

// ─── Matchmaking ─────────────────────────────────────────────────────────────

export const joinQueue = async (uid: string, profile: any, mode: string, onMatchFound: (gameId: string) => void) => {
  const queueRef = doc(db, 'matchmaking', uid);
  
  // 1. Join queue
  await setDoc(queueRef, {
    uid,
    username: profile.username,
    photoURL: profile.photoURL,
    elo: profile.elo,
    mode,
    status: 'searching',
    joinedAt: serverTimestamp(),
  });

  // 2. Try to find an opponent
  const q = query(
    collection(db, 'matchmaking'),
    where('mode', '==', mode),
    where('status', '==', 'searching'),
    limit(5)
  );

  const snapshot = await getDocs(q);
  const opponents = snapshot.docs.filter(d => d.id !== uid);

  if (opponents.length > 0) {
    const opponent = opponents[0].data();
    const gameId = `${uid}_${opponent.uid}_${Date.now()}`;

    // Found someone! Let's create the game
    const batch = writeBatch(db);
    
    const gameRef = doc(db, 'games', gameId);
    const gameState: GameState = {
      players: {
        [uid]: { username: profile.username, photoURL: profile.photoURL, elo: profile.elo, color: 'w' },
        [opponent.uid]: { username: opponent.username, photoURL: opponent.photoURL, elo: opponent.elo, color: 'b' }
      },
      playerUids: [uid, opponent.uid],
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      history: [],
      status: 'active',
      turn: 'w',
      lastMoveAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    batch.set(gameRef, gameState);
    
    // Update both queue docs to notify them
    batch.update(queueRef, { status: 'matched', gameId });
    batch.update(doc(db, 'matchmaking', opponent.uid), { status: 'matched', gameId });

    await batch.commit();
    return;
  }

  // 3. Listen for matching if we didn't find one immediately
  const unsub = onSnapshot(queueRef, (snap) => {
    const data = snap.data();
    if (data?.status === 'matched' && data.gameId) {
      unsub();
      onMatchFound(data.gameId);
      // Clean up queue doc after a delay
      setTimeout(() => deleteDoc(queueRef), 2000);
    }
  });

  return unsub;
};

export const leaveQueue = async (uid: string) => {
  await deleteDoc(doc(db, 'matchmaking', uid));
};

// ─── Game Sync ─────────────────────────────────────────────────────────────

export const listenToGame = (gameId: string, callback: (game: GameState) => void) => {
  return onSnapshot(doc(db, 'games', gameId), (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...snap.data() } as GameState);
    }
  });
};

export const submitMove = async (gameId: string, fen: string, move: string, nextTurn: 'w' | 'b') => {
  const gameRef = doc(db, 'games', gameId);
  
  await updateDoc(gameRef, {
    fen,
    history: arrayUnion(move),
    turn: nextTurn,
    lastMoveAt: serverTimestamp(),
  });
};

export const updateGameStatus = async (gameId: string, status: string, winner?: string) => {
  if (!gameId) {
    console.error('updateGameStatus: No gameId provided');
    return;
  }
  await updateDoc(doc(db, 'games', gameId), {
    status,
    winner,
  });
};

// ─── Chat System ─────────────────────────────────────────────────────────────

export interface ChatMessage {
  id?: string;
  uid: string;
  username: string;
  text: string;
  createdAt: any;
}

export const sendGameMessage = async (gameId: string, uid: string, username: string, text: string) => {
  const messagesRef = collection(db, 'games', gameId, 'messages');
  await addDoc(messagesRef, {
    uid,
    username,
    text,
    createdAt: serverTimestamp(),
  });
};

export const listenToMessages = (gameId: string, callback: (messages: ChatMessage[]) => void) => {
  const q = query(
    collection(db, 'games', gameId, 'messages'),
    orderBy('createdAt', 'asc'),
    limit(50)
  );
  
  return onSnapshot(q, (snap) => {
    const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
    callback(msgs);
  });
};
