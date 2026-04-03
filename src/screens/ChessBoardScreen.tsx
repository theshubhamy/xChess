import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, Dimensions, ScrollView, Platform } from 'react-native';
import { 
  Flag, Handshake, History, MessageCircle, ChevronLeft,
  ChessPawn, ChessRook, ChessKnight, ChessBishop, ChessQueen, ChessKing 
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { GameEngine } from '../services/gameEngine';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width - 32;
const SQUARE_SIZE = (BOARD_SIZE - 8) / 8;

const ChessBoardScreen = ({ navigation, route }: any) => {
  const { opponent } = route.params || { opponent: 'Magnus_C' };
  
  const [engine] = useState(() => new GameEngine());
  const [fen, setFen] = useState(engine.getFen());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

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

      const moveResult = engine.makeMove({ from: selectedSquare, to: square, promotion: 'q' });
      
      if (moveResult.success) {
        setFen(engine.getFen());
        setHistory(prev => [...prev, moveResult.move?.san || '']);
        setSelectedSquare(null);
        setLegalMoves([]);

        if (moveResult.isGameOver) {
          navigation.navigate('GameOver', { result: engine.getGameStatus() });
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

  const renderPiece = (piece: { type: string; color: string } | null) => {
    if (!piece) return null;
    
    const props = {
      size: SQUARE_SIZE * 0.7,
      color: piece.color === 'w' ? '#FFF' : '#333',
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
          { backgroundColor: isDark ? Colors.surfaceContainerLow : Colors.surfaceContainerHighest },
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

  const renderPlayerHeader = (name: string, elo: string, time: string, isActive: boolean) => (
    <View style={[styles.playerHeader, isActive && styles.playerHeaderActive]}>
      <View style={styles.playerMain}>
        <View style={styles.miniAvatar} />
        <View>
          <Text style={styles.headerName}>{name.toUpperCase()}</Text>
          <Text style={styles.headerElo}>{elo} ELO</Text>
        </View>
      </View>
      <View style={[styles.timerBadge, isActive && styles.timerBadgeActive]}>
        <Text style={[styles.timerText, isActive && styles.timerTextActive]}>{time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color={Colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.navTitle}>GRANDMASTER DUEL</Text>
            <TouchableOpacity>
              <MessageCircle size={22} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <View style={styles.gameContent}>
            {renderPlayerHeader(opponent, '2860', '02:45', engine.getTurn() === 'b')}

            <View style={styles.boardContainer}>
              <View style={styles.boardLabelColumn}>
                {['8', '7', '6', '5', '4', '3', '2', '1'].map((l) => (
                  <Text key={l} style={styles.boardLabel}>{l}</Text>
                ))}
              </View>
              <View style={styles.boardWrapper}>
                <View style={styles.mainBoard}>
                  {renderBoard()}
                </View>
                <View style={styles.boardLabelRow}>
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((l) => (
                    <Text key={l} style={styles.boardLabel}>{l}</Text>
                  ))}
                </View>
              </View>
            </View>

            {renderPlayerHeader('Grandmaster Vance', '2150', '03:12', engine.getTurn() === 'w')}

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
              onPress={() => navigation.navigate('GameOver', { result: 'Resigned' })}
            >
              <Flag size={20} color={Colors.error} />
              <Text style={[styles.dockText, { color: Colors.error }]}>RESIGN</Text>
            </TouchableOpacity>
          </View>
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
  resignButton: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.05)',
  },
});

export default ChessBoardScreen;
