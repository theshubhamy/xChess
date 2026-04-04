import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { GameEngine } from '../services/gameEngine';
import {
  listenToGame,
  submitMove,
  updateGameStatus,
  sendGameMessage,
  listenToMessages,
  saveGameHistory,
  GameState,
  ChatMessage
} from '../services/multiplayer';
import { getCurrentUser } from '../services/auth';
import { formatTime } from '../utils/formatters';

interface UseChessGameProps {
  gameId: string;
  isAi: boolean;
  navigation: any;
}

export const useChessGame = ({ gameId, isAi, navigation }: UseChessGameProps) => {
  const user = getCurrentUser();
  const [engine] = useState(() => new GameEngine());
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [fen, setFen] = useState(engine.getFen());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [history, setHistory] = useState<{ san: string; t: string }[]>([]);
  const [reviewIndex, setReviewIndex] = useState<number>(-1);
  const [reviewFen, setReviewFen] = useState<string | null>(null);

  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Timer State
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const timerRef = useRef<any>(null);

  const opponentUid = gameState?.playerUids.find(id => id !== user?.uid);
  const myColor = isAi ? 'w' : (gameState?.playerUids[0] === user?.uid ? 'w' : 'b');
  const isMyTurn = isAi ? engine.getTurn() === 'w' : (gameState?.turn === myColor);

  // 1. Sync with Firestore
  useEffect(() => {
    const activeChatId = gameId || (isAi ? `AI_MATCH_${user?.uid}` : null);
    if (!activeChatId) return;

    const unsubGame = gameId ? listenToGame(gameId, (data) => {
      setGameState(data);
      setWhiteTime(data.whiteTime ?? 600);
      setBlackTime(data.blackTime ?? 600);
      if (data.fen !== engine.getFen()) {
        engine.load(data.fen);
        setFen(data.fen);
        setHistory(data.history || []);
      }
    }) : () => { };

    const unsubChat = listenToMessages(activeChatId, (msgs) => {
      setMessages(msgs);
      if (msgs.length > 0 && !showChat) {
        setHasNewMessage(true);
      }
    });

    return () => {
      unsubGame();
      unsubChat();
    };
  }, [gameId, isAi, showChat, user?.uid]);

  // Timer logic
  useEffect(() => {
    if (!isAi && gameState?.status && gameState.status !== 'active') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const currentTurn = !isAi && gameState?.turn ? gameState.turn : engine.getTurn();
      if (currentTurn === 'w') {
        setWhiteTime(t => Math.max(0, t - 1));
      } else if (currentTurn === 'b') {
        setBlackTime(t => Math.max(0, t - 1));
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fen, gameState?.status, isAi]);

  // Handle AI Move
  useEffect(() => {
    if (isAi && engine.getTurn() === 'b' && !engine.isGameOver()) {
      const timer = setTimeout(() => {
        const aiMove = engine.getAiMove();
        if (aiMove) {
          const res = engine.makeMove(aiMove);
          if (res.success) {
            setFen(engine.getFen());
            setHistory(prev => [...prev, { san: res.move?.san || '', t: formatTime(blackTime) }]);
            if (res.isGameOver) {
              const gameStatus = engine.getGameStatus();
              recordGameResult(gameStatus, false, 0, 'AI Level 1');
            }
          }
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [fen, isAi, blackTime]);

  const recordGameResult = async (status: string, isVictory: boolean, eloChange: number, opponentName: string) => {
    if (!user) return;

    if (isAi) {
      await saveGameHistory({
        playerUids: [user.uid],
        players: {
          [user.uid]: {
            username: user.displayName || 'Player',
            photoURL: user.photoURL || 'User',
            elo: 0,
            color: 'w'
          },
          'AI': {
            username: opponentName,
            photoURL: 'Bot',
            elo: 0,
            color: 'b'
          }
        },
        status: status.toLowerCase() as any,
        winner: isVictory ? user.uid : (status === 'Checkmate' ? 'AI' : undefined),
        mode: 'AI',
        history: history,
        fen: engine.getFen(),
        whiteTime,
        blackTime,
      });
    } else if (gameId) {
      await updateGameStatus(gameId, status, isVictory ? user.uid : undefined, whiteTime, blackTime);
    }

    navigation.navigate('GameOver', {
      result: status,
      isVictory,
      eloChange: isAi ? 0 : eloChange,
      opponent: opponentName,
      moveCount: history.length,
      history: history,
      matchId: gameId || 'AI_MATCH'
    });
  };

  const handleSquarePress = (row: number, col: number) => {
    if (reviewIndex !== -1) return;
    if (gameState?.status && gameState.status !== 'active') return;

    // Simple util for col/ranks
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const square = `${files[col]}${ranks[row]}`;

    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
      if (!isMyTurn) return;

      const moveResult = engine.makeMove({ from: selectedSquare, to: square, promotion: 'q' });
      if (moveResult.success) {
        const newFen = engine.getFen();
        setFen(newFen);
        const moveObj = { san: moveResult.move?.san || '', t: formatTime(myColor === 'w' ? whiteTime : blackTime) };
        setHistory(prev => [...prev, moveObj]);
        setSelectedSquare(null);
        setLegalMoves([]);

        if (!isAi && gameId) {
          submitMove(gameId, newFen, moveObj, engine.getTurn(), whiteTime, blackTime);
        }

        if (moveResult.isGameOver) {
          const gameStatus = engine.getGameStatus();
          const isDraw = ['Draw', 'Stalemate', 'Threefold Repetition', 'Insufficient Material'].includes(gameStatus);
          const isCheckmate = gameStatus === 'Checkmate';
          const eloChange = isCheckmate ? 18 : (isDraw ? 2 : -15);
          const opponentName = isAi ? 'AI Level 1' : (gameState?.players[opponentUid || '']?.username || 'Opponent');
          recordGameResult(gameStatus, isCheckmate, eloChange, opponentName);
        }
        return;
      }
    }

    const moves = engine.getMoves().filter(m => m.from === square).map(m => m.to);
    if (moves.length > 0) {
      setSelectedSquare(square);
      setLegalMoves(moves);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const handleReviewMove = (index: number) => {
    if (index === -1) {
      setReviewIndex(-1);
      setReviewFen(null);
      return;
    }
    const replayEngine = new GameEngine();
    for (let i = 0; i <= index; i++) {
      replayEngine.makeMove(history[i].san);
    }
    setReviewIndex(index);
    setReviewFen(replayEngine.getFen());
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const handleResign = () => {
    Alert.alert('Resign', 'Are you sure you want to resign?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Resign',
        style: 'destructive',
        onPress: () => {
          const eloChange = -20;
          const opponentName = isAi ? 'AI Level 1' : (gameState?.players[opponentUid || '']?.username || 'Opponent');
          recordGameResult('Resigned', false, eloChange, opponentName);
        }
      }
    ]);
  };

  const handleSendMessage = () => {
    const activeGameId = gameId || (isAi ? `AI_MATCH_${user?.uid}` : null);
    if (!inputText.trim() || !user || !activeGameId) return;

    sendGameMessage(activeGameId, user.uid, (gameState?.players[user.uid]?.username || user.displayName || 'Player'), inputText.trim());
    setInputText('');
  };

  return {
    user,
    engine,
    gameState,
    fen,
    selectedSquare,
    legalMoves,
    history,
    reviewIndex,
    reviewFen,
    showChat,
    setShowChat,
    messages,
    inputText,
    setInputText,
    hasNewMessage,
    setHasNewMessage,
    whiteTime,
    blackTime,
    myColor,
    isMyTurn,
    handleSquarePress,
    handleReviewMove,
    handleResign,
    handleSendMessage,
    opponentUid
  };
};
