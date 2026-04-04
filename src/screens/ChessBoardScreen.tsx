import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
  Platform,
  Modal,
  TextInput,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Flag, Handshake, History, MessageCircle, ChevronLeft, X, Send, Zap,
  ChessPawn, ChessRook, ChessKnight, ChessBishop, ChessQueen, ChessKing
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { GameEngine } from '../services/gameEngine';
import { ProfileAvatar } from '../components/ProfileAvatar';
import { formatTime } from '../utils/formatters';
import { useChessGame } from '../hooks/useChessGame';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width - 32;
const SQUARE_SIZE = (BOARD_SIZE - 8) / 8;

const ChessBoardScreen = ({ navigation, route }: any) => {
  const { gameId, isAi } = route.params || { gameId: '', isAi: false };

  const {
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
  } = useChessGame({ gameId, isAi, navigation });
  const chatListRef = React.useRef<any>(null);

  const getSquareName = (row: number, col: number) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return `${files[col]}${ranks[row]}`;
  };

  const renderPiece = (piece: { type: string; color: string } | null) => {
    if (!piece) return null;

    const props = {
      size: SQUARE_SIZE * 0.7,
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

    const board = reviewFen ? new GameEngine(reviewFen).getBoard() : engine.getBoard();
    const piece = board[row][col];

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        activeOpacity={0.8}
        onPress={() => handleSquarePress(row, col)}
        style={[
          styles.square,
          {
            backgroundColor: isDark ? '#2d3449' : '#d8e3fb'
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

  const renderPlayerHeader = (uid: string | undefined, time: string, isAiMatch: boolean, isAiOpponent?: boolean) => {
    let name = 'PLAYER';
    let elo = '????';
    let photo = 'User';
    let isActive = false;

    if (isAiMatch) {
      if (isAiOpponent) {
        name = 'AI LEVEL 1';
        photo = 'Bot';
        isActive = engine.getTurn() === 'b';
      } else {
        name = user?.displayName?.toUpperCase() || 'YOU';
        photo = user?.photoURL || 'User';
        isActive = engine.getTurn() === 'w';
      }
    } else {
      const playerArr = gameState?.playerUids || [];
      const isWhite = uid === playerArr[0];
      const player = uid ? gameState?.players[uid] : null;
      name = player?.username?.toUpperCase() || 'PLAYER';
      elo = player?.elo?.toString() || '????';
      photo = player?.photoURL || 'User';
      isActive = gameState?.turn === (isWhite ? 'w' : 'b');
    }

    return (
      <View style={[styles.playerHeader, isActive && styles.playerHeaderActive]}>
        <View style={styles.playerMain}>
          <ProfileAvatar iconName={photo} size={18} containerSize={36} isGold={!isAiOpponent && parseInt(elo) > 2500} />
          <View>
            <Text style={styles.headerName}>{name}</Text>
            {/* ♟ Only show ELO if it's a real multiplayer game with valid data */}
            {!isAiMatch && elo !== '????' && (
              <Text style={styles.headerElo}>{elo} ELO</Text>
            )}
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
            {renderPlayerHeader(isAi ? undefined : opponentUid, formatTime(myColor === 'w' ? blackTime : whiteTime), isAi, isAi)}

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

            {renderPlayerHeader(user?.uid, formatTime(myColor === 'w' ? whiteTime : blackTime), isAi, false)}

            <View style={styles.moveListSection}>
              <Text style={styles.moveLabel}>NOTATION HISTORY</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moveScroll}>
                {history.length > 0 ? (
                  history.map((m, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.moveItem, reviewIndex === i && styles.moveItemActive]}
                      onPress={() => handleReviewMove(i)}
                    >
                      <Text style={[styles.moveText, reviewIndex === i && styles.moveTextActive]}>{m.san}</Text>
                      <Text style={styles.moveTime}>{m.t}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.emptyHistory}>Awaiting the first move...</Text>
                )}
              </ScrollView>
              {reviewIndex !== -1 && (
                <TouchableOpacity style={styles.liveBtn} onPress={() => handleReviewMove(-1)}>
                  <Zap size={14} color={Colors.tertiary} />
                  <Text style={styles.liveBtnText}>VIEW LIVE BOARD</Text>
                </TouchableOpacity>
              )}
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
                ref={chatListRef}
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
                onContentSizeChange={() => chatListRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => chatListRef.current?.scrollToEnd({ animated: true })}
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
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center',
    minWidth: 44,
  },
  moveItemActive: {
    backgroundColor: 'rgba(234, 195, 74, 0.12)',
    borderColor: 'rgba(234, 195, 74, 0.3)',
  },
  moveText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  moveTextActive: {
    color: Colors.tertiary,
    fontWeight: '900',
  },
  moveTime: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.tertiary,
    marginTop: 2,
    opacity: 0.65,
  },
  liveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
    backgroundColor: 'rgba(234, 195, 74, 0.08)',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(234, 195, 74, 0.25)',
  },
  liveBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
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
