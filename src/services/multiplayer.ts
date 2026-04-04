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
import database, { getDatabase, ref, push, set, onValue, off, serverTimestamp as rtdbTimestamp, query as rtdbQuery, orderByChild, limitToLast } from '@react-native-firebase/database';

import { GAME_MODES, INITIAL_TIME } from '../constants/gameData';
import { formatDateShort } from '../utils/formatters';

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
  history: { san: string; t: string }[];
  status: 'active' | 'checkmate' | 'draw' | 'resigned';
  winner?: string;
  turn: 'w' | 'b';
  whiteTime: number;
  blackTime: number;
  lastMoveAt: any;
  createdAt: any;
  mode?: string;
}

const db = getFirestore();
const rtdb = getDatabase();

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
    const initialTime = INITIAL_TIME[mode as keyof typeof INITIAL_TIME] || INITIAL_TIME[GAME_MODES.BLITZ];

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
      whiteTime: initialTime,
      blackTime: initialTime,
      mode,
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

export const submitMove = async (gameId: string, fen: string, moveObj: { san: string; t: string }, nextTurn: 'w' | 'b', whiteTime?: number, blackTime?: number) => {
  const gameRef = doc(db, 'games', gameId);

  const updates: any = {
    fen,
    history: arrayUnion(moveObj),
    turn: nextTurn,
    lastMoveAt: serverTimestamp(),
  };

  if (whiteTime !== undefined) updates.whiteTime = whiteTime;
  if (blackTime !== undefined) updates.blackTime = blackTime;

  await updateDoc(gameRef, updates);
};

export const updateGameStatus = async (gameId: string, status: string, winner?: string, whiteTime?: number, blackTime?: number) => {
  if (!gameId) {
    console.error('updateGameStatus: No gameId provided');
    return;
  }
  const updates: any = {
    status: status.toLowerCase(),
    winner: winner || null,
    lastMoveAt: serverTimestamp(),
  };

  if (whiteTime !== undefined) updates.whiteTime = whiteTime;
  if (blackTime !== undefined) updates.blackTime = blackTime;

  await updateDoc(doc(db, 'games', gameId), updates);
};

/**
 * Saves a completed game (AI or Local) to Firestore history
 */
export const saveGameHistory = async (gameData: Partial<GameState>) => {
  try {
    const gamesRef = collection(db, 'games');

    // Clean undefined values from gameData
    const cleanedData = Object.fromEntries(
      Object.entries(gameData).filter(([_, v]) => v !== undefined)
    );

    const docRef = await addDoc(gamesRef, {
      ...cleanedData,
      createdAt: serverTimestamp(),
      lastMoveAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('saveGameHistory error:', error);
    return null;
  }
};

// ─── Chat System (Firebase Realtime Database) ──────────────────────────────────

export interface ChatMessage {
  id?: string;
  uid: string;
  username: string;
  text: string;
  createdAt: number;
}

export const sendGameMessage = async (gameId: string, uid: string, username: string, text: string) => {
  try {
    const messageRef = push(ref(rtdb, `messages/${gameId}`));
    await set(messageRef, {
      uid,
      username,
      text,
      createdAt: rtdbTimestamp(),
    });
  } catch (error) {
    console.error('sendGameMessage error:', error);
  }
};

export const listenToMessages = (gameId: string, callback: (messages: ChatMessage[]) => void) => {
  const messagesRef = rtdbQuery(ref(rtdb, `messages/${gameId}`), orderByChild('createdAt'), limitToLast(50));

  const callbackWrapper = (snapshot: any) => {
    const data = snapshot.val();
    if (data) {
      const msgs = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) as ChatMessage[];
      callback(msgs);
    } else {
      callback([]);
    }
  };

  const unsubscribe = onValue(messagesRef, callbackWrapper);
  return unsubscribe;
};

// ─── Recent Games ─────────────────────────────────────────────────────────────

export const listenToRecentGames = (uid: string, callback: (games: any[]) => void, limitCount: number = 5) => {
  const q = query(
    collection(db, 'games'),
    where('playerUids', 'array-contains', uid),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  return onSnapshot(q, (snap) => {
    const games = snap.docs.map(doc => {
      const data = doc.data();
      const isWinner = data.winner === uid;
      const isDraw = data.status === 'draw' || data.status === 'stalemate' || data.status === 'draw_accepted';
      const opponentUid = data.playerUids.find((id: string) => id !== uid);
      const opponent = data.players?.[opponentUid] || { username: 'Guest', photoURL: 'User' };

      const date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
      const timeStr = formatDateShort(date);

      return {
        id: doc.id,
        opponentName: opponent.username,
        opponentPhoto: opponent.photoURL,
        mode: data.mode || 'Blitz',
        result: isDraw ? 'DRAW' : (isWinner ? 'WIN' : 'LOSS'),
        win: isWinner,
        draw: isDraw,
        time: timeStr,
        elo: isWinner ? '+15' : (isDraw ? '+0' : '-12'),
      };
    });
    callback(games);
  }, err => {
    console.error('listenToRecentGames error:', err);
    callback([]);
  });
};


