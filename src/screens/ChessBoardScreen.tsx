import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Flag, Handshake, History, MessageCircle, ChevronLeft, X, Send,
  ChessPawn, ChessRook, ChessKnight, ChessBishop, ChessQueen, ChessKing
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { GameEngine } from '../services/gameEngine';
import { listenToGame, submitMove, updateGameStatus, GameState, sendGameMessage, listenToMessages, ChatMessage } from '../services/multiplayer';
import { getCurrentUser } from '../services/auth';
import { ProfileAvatar } from '../components/ProfileAvatar';
import { Modal, TextInput, FlatList, Alert } from 'react-native';
import { formatTime } from '../utils/formatters';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width - 32;
const SQUARE_SIZE = (BOARD_SIZE - 8) / 8;

const ChessBoardScreen = ({ navigation, route }: any) => {
  const { gameId, isAi } = route.params || { gameId: '', isAi: false };
  const user = getCurrentUser();

  const [engine] = useState(() => new GameEngine());
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [fen, setFen] = useState(engine.getFen());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Timer State
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const timerRef = useRef<any>(null);

  const opponentUid = gameState?.playerUids.find(id => id !== user?.uid);

  // 1. Sync with Firestore
  useEffect(() => {
    if (!gameId || isAi) return;

    const unsubGame = listenToGame(gameId, (data) => {
      setGameState(data);
      setWhiteTime(data.whiteTime);
      setBlackTime(data.blackTime);
      if (data.fen !== engine.getFen()) {
        engine.load(data.fen);
        setFen(data.fen);
        setHistory(data.history);
      }
    });

    const unsubChat = listenToMessages(gameId, (msgs) => {
      setMessages(msgs);
      if (!showChat && msgs.length > 0) setHasNewMessage(true);
    });

    return () => {
      unsubGame();
      unsubChat();
    };
  }, [gameId, showChat]);

  // 1.1 Timer logic
  useEffect(() => {
    if (gameState?.status && gameState.status !== 'active') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const turn = engine.getTurn();
      if (turn === 'w') {
        setWhiteTime(t => Math.max(0, t - 1));
      } else {
        setBlackTime(t => Math.max(0, t - 1));
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fen, gameState?.status]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !user || !gameId) return;
    sendGameMessage(gameId, user.uid, (gameState?.players[user.uid]?.username || 'Player'), inputText.trim());
    setInputText('');
  };

  const myColor = isAi ? 'w' : (gameState?.playerUids[0] === user?.uid ? 'w' : 'b');
  const isMyTurn = isAi ? engine.getTurn() === 'w' : (gameState?.turn === myColor);

  useEffect(() => {
    // 2. Handle AI Move
    if (isAi && engine.getTurn() === 'b' && !engine.isGameOver()) {
      const timer = setTimeout(() => {
        const aiMove = engine.getAiMove();
        if (aiMove) {
          const res = engine.makeMove(aiMove);
          if (res.success) {
            setFen(engine.getFen());
            setHistory(prev => [...prev, res.move?.san || '']);
            if (res.isGameOver) {
              const gameStatus = engine.getGameStatus();
              navigation.navigate('GameOver', {
                result: gameStatus,
                isVictory: false,
                opponent: 'AI Level 1',
                eloChange: 0,
                moveCount: history.length + 1,
                matchId: 'AI_MATCH'
              });
            }
          }
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [fen, isAi]);

  const getSquareName = (row: number, col: number) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return `${files[col]}${ranks[row]}`;
  };

  const handleSquarePress = (row: number, col: number) => {
    const square = getSquareName(row, col);

    // If a square is already selected, try to move
    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      // Only allow moves if it's my turn
      if (!isMyTurn) return;

      const moveResult = engine.makeMove({ from: selectedSquare, to: square, promotion: 'q' });

      if (moveResult.success) {
        const newFen = engine.getFen();
        setFen(newFen);
        setHistory(prev => [...prev, moveResult.move?.san || '']);
        setSelectedSquare(null);
        setLegalMoves([]);

        // 2. Push to Firestore (if multiplayer)
        if (!isAi && gameId) {
          submitMove(gameId, newFen, moveResult.move?.san || '', engine.getTurn(), whiteTime, blackTime);
        }

        if (moveResult.isGameOver) {
          const gameStatus = engine.getGameStatus();
          const isDraw = ['Draw', 'Stalemate', 'Threefold Repetition', 'Insufficient Material'].includes(gameStatus);
          const isCheckmate = gameStatus === 'Checkmate';

          // Use more accurate ELO logic from service
          const eloChange = isCheckmate ? 18 : (isDraw ? 2 : -15);

          if (!isAi && gameId) {
            updateGameStatus(gameId, gameStatus, isCheckmate ? user?.uid : undefined);
          }

          navigation.navigate('GameOver', {
            result: gameStatus,
            isVictory: isCheckmate,
            eloChange: isAi ? 0 : eloChange,
            opponent: isAi ? 'AI Level 1' : (gameState?.players[opponentUid || '']?.username || 'Opponent'),
            moveCount: history.length + 1,
            matchId: gameId || 'LOCAL'
          });
        }
        return;
      }
    }

    // Otherwise, select the square and show legal moves
    const moves = engine.getMoves().filter(m => m.from === square).map(m => m.to);
    if (moves.length > 0) {
      setSelectedSquare(square);
      setLegalMoves(moves);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const handleResign = () => {
    Alert.alert('Resign', 'Are you sure you want to resign?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Resign',
        style: 'destructive',
        onPress: () => {
          const eloChange = -20;
          if (!isAi && gameId && opponentUid) {
            updateGameStatus(gameId, 'Resigned', opponentUid);
          }
          navigation.navigate('GameOver', {
            result: 'Resigned',
            isVictory: false,
            eloChange: isAi ? 0 : eloChange,
            opponent: isAi ? 'AI Level 1' : (gameState?.players[opponentUid || '']?.username || 'Opponent'),
            moveCount: history.length,
            matchId: gameId || 'LOCAL'
          });
        }
      }
    ]);
  };


  const renderPiece = (piece: { type: string; color: string } | null) => {
    if (!piece) return null;

    const props = {
      size: SQUARE_SIZE * 0.7,
      // Stitch "Gold & Silver accents" for pieces
      color: piece.color === 'w' ? Colors.tertiary : Colors.primary,
      strokeWidth: 2,
    };

    switch (piece.type) {
      case 'p': return <ChessPawn {...props} />;
      case 'r': return <ChessRook {...props} />;
      case 'n': return <ChessKnight {...props} />;
      case 'b': return <ChessBishop {...props} />;
      case 'q': return <ChessQueen {...props} />;
      case 'k': return <ChessKing {...props} />;
      default: return null;
    }
  };

  const renderSquare = (row: number, col: number) => {
    const squareName = getSquareName(row, col);
    const isDark = (row + col) % 2 === 1;
    const isSelected = selectedSquare === squareName;
    const isLegalMove = legalMoves.includes(squareName);

    // Get piece from engine board
    const board = engine.getBoard();
    const piece = board[row][col];

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        activeOpacity={0.8}
        onPress={() => handleSquarePress(row, col)}
        style={[
          styles.square,
          {
            // Stitch "The Material Board" rule
            backgroundColor: isDark ? '#2d3449' : '#d8e3fb' // surface_container_highest and primary_fixed
          },
          isSelected && styles.selectedSquare,
        ]}
      >
        {isLegalMove && <View style={styles.legalMoveDot} />}
        {renderPiece(piece)}
      </TouchableOpacity>
    );
  };

  const renderBoard = () => {
    let rows = [];
    for (let i = 0; i < 8; i++) {
      let squares = [];
      for (let j = 0; j < 8; j++) {
        squares.push(renderSquare(i, j));
      }
      rows.push(<View key={i} style={styles.boardRow}>{squares}</View>);
    }
    return rows;
  };

  const renderPlayerHeader = (uid: string | undefined, time: string) => {
    const playerArr = gameState?.playerUids || [];
    const isWhite = uid === playerArr[0];
    const player = uid ? gameState?.players[uid] : null;
    const isActive = gameState?.turn === (isWhite ? 'w' : 'b');

    return (
      <View style={[styles.playerHeader, isActive && styles.playerHeaderActive]}>
        <View style={styles.playerMain}>
          <ProfileAvatar iconName={player?.photoURL} size={18} containerSize={36} isGold={!!(player?.elo && player.elo > 2500)} />
          <View>
            <Text style={styles.headerName}>{player?.username?.toUpperCase() || 'PLAYER'}</Text>
            <Text style={styles.headerElo}>{player?.elo || '????'} ELO</Text>
          </View>
        </View>
        <View style={[styles.timerBadge, isActive && styles.timerBadgeActive]}>
          <Text style={[styles.timerText, isActive && styles.timerTextActive]}>{time}</Text>
        </View>
      </View>
    );
  };



  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color={Colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.navTitle}>GRANDMASTER DUEL</Text>
            <TouchableOpacity style={styles.chatIconBtn} onPress={() => setShowChat(true)}>
              <MessageCircle size={22} color={hasNewMessage ? Colors.tertiary : Colors.onSurface} />
              {hasNewMessage && <View style={styles.chatDot} />}
            </TouchableOpacity>
          </View>

          <View style={styles.gameContent}>
            {renderPlayerHeader(opponentUid, formatTime(myColor === 'w' ? blackTime : whiteTime))}

            <View style={styles.boardContainer}>
              <View style={styles.boardLabelColumn}>
                {['8', '7', '6', '5', '4', '3', '2', '1'].map((l) => (
                  <Text key={l} style={styles.boardLabel}>{l}</Text>
                ))}
              </View>
              <View style={styles.boardWrapper}>
                <View style={[styles.mainBoard, myColor === 'b' && { transform: [{ rotate: '180deg' }] }]}>
                  {renderBoard()}
                </View>
                <View style={styles.boardLabelRow}>
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((l) => (
                    <Text key={l} style={styles.boardLabel}>{l}</Text>
                  ))}
                </View>
              </View>
            </View>

            {renderPlayerHeader(user?.uid, formatTime(myColor === 'w' ? whiteTime : blackTime))}

            <View style={styles.moveListSection}>
              <Text style={styles.moveLabel}>NOTATION HISTORY</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moveScroll}>
                {history.length > 0 ? (
                  history.map((m, i) => (
                    <View key={i} style={styles.moveItem}>
                      <Text style={styles.moveText}>{m}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyHistory}>Awaiting the first move...</Text>
                )}
              </ScrollView>
            </View>
          </View>

          <View style={styles.actionDock}>
            <TouchableOpacity style={styles.dockButton}>
              <Handshake size={20} color={Colors.onSurfaceVariant} />
              <Text style={styles.dockText}>DRAW</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dockButton}>
              <History size={20} color={Colors.onSurfaceVariant} />
              <Text style={styles.dockText}>LOG</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dockButton, styles.resignButton]}
              onPress={handleResign}
            >
              <Flag size={20} color={Colors.error} />
              <Text style={[styles.dockText, { color: Colors.error }]}>RESIGN</Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={showChat}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowChat(false)}
          >
            <View style={styles.chatOverlay}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatTitle}>IN-GAME CHAT</Text>
                <TouchableOpacity onPress={() => { setShowChat(false); setHasNewMessage(false); }}>
                  <X size={24} color={Colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>

              <FlatList
                data={messages}
                keyExtractor={(item) => item.id || Math.random().toString()}
                renderItem={({ item }) => (
                  <View style={[styles.msgWrap, item.uid === user?.uid && styles.msgWrapMy]}>
                    <View style={[styles.msgBubble, item.uid === user?.uid && styles.msgBubbleMy]}>
                      <Text style={styles.msgUser}>{item.username}</Text>
                      <Text style={styles.msgText}>{item.text}</Text>
                    </View>
                  </View>
                )}
                style={styles.msgList}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
              />

              <View style={styles.chatInputRow}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Send message..."
                  placeholderTextColor={Colors.outline}
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={handleSendMessage}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
                  <Send size={18} color={Colors.background} />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  navTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 2,
  },
  chatIconBtn: {
    padding: 8,
  },
  gameContent: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginBottom: 10,
  },
  playerHeaderActive: {
    backgroundColor: 'rgba(234, 195, 74, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(234, 195, 74, 0.2)',
  },
  playerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  headerName: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 0.5,
  },
  headerElo: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontWeight: '700',
  },
  timerBadge: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  timerBadgeActive: {
    backgroundColor: Colors.tertiary,
    borderColor: Colors.tertiary,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  timerTextActive: {
    color: Colors.onTertiary,
  },
  boardContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  boardLabelColumn: {
    width: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 4,
  },
  boardLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.surfaceContainerHighest,
  },
  boardWrapper: {
    flex: 1,
  },
  mainBoard: {
    width: BOARD_SIZE - 16,
    height: BOARD_SIZE - 16,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: Colors.surfaceContainerLow,
  },
  boardRow: {
    flexDirection: 'row',
  },
  square: {
    width: (BOARD_SIZE - 24) / 8,
    height: (BOARD_SIZE - 24) / 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSquare: {
    backgroundColor: 'rgba(234, 195, 74, 0.3)',
  },
  legalMoveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(234, 195, 74, 0.4)',
    position: 'absolute',
    zIndex: 1,
  },
  boardLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  moveListSection: {
    marginTop: 20,
    paddingHorizontal: 8,
  },
  moveLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.surfaceContainerHighest,
    letterSpacing: 1,
    marginBottom: 10,
  },
  moveScroll: {
    flexDirection: 'row',
  },
  moveItem: {
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
  },
  moveText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  emptyHistory: {
    fontSize: 12,
    color: Colors.surfaceContainerHighest,
    fontStyle: 'italic',
  },
  actionDock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  dockButton: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  dockText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  chatDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.tertiary,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  chatOverlay: {
    flex: 1,
    marginTop: 100,
    backgroundColor: 'rgba(11, 19, 38, 0.98)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  chatTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 2,
  },
  msgList: {
    flex: 1,
  },
  msgWrap: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  msgWrapMy: {
    justifyContent: 'flex-end',
  },
  msgBubble: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    maxWidth: '80%',
  },
  msgBubbleMy: {
    backgroundColor: 'rgba(234, 195, 74, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(234, 195, 74, 0.2)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 4,
  },
  msgUser: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.tertiary,
    marginBottom: 4,
  },
  msgText: {
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 18,
  },
  chatInputRow: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 40,
    gap: 12,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  chatInput: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 14,
    paddingHorizontal: 16,
    color: Colors.onSurface,
    fontSize: 14,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resignButton: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.05)',
  },
});

export default ChessBoardScreen;
