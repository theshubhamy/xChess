import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width - 32;

const ChessBoardScreen = ({ navigation, route }: any) => {
  const renderSquare = (row: number, col: number) => {
    const isDark = (row + col) % 2 === 1;
    return (
      <View 
        key={`${row}-${col}`}
        style={[
          styles.square, 
          { backgroundColor: isDark ? Colors.surfaceContainerHighest : Colors.primary }
        ]}
      />
    );
  };

  const renderBoard = () => {
    let board = [];
    for (let i = 0; i < 8; i++) {
      let row = [];
      for (let j = 0; j < 8; j++) {
        row.push(renderSquare(i, j));
      }
      board.push(<View key={i} style={styles.row}>{row}</View>);
    }
    return board;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Opponent Info */}
      <View style={styles.playerCardTop}>
        <View style={styles.avatarSmall} />
        <View>
          <Text style={styles.playerName}>Grandmaster Vance</Text>
          <Text style={styles.playerElo}>2150 ELO</Text>
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>04:32</Text>
        </View>
      </View>
      
      <View style={styles.boardContainer}>
        {renderBoard()}
      </View>
      
      {/* User Info */}
      <View style={styles.playerCardBottom}>
        <View style={styles.avatarSmall} />
        <View>
          <Text style={styles.playerName}>You</Text>
          <Text style={styles.playerElo}>2140 ELO</Text>
        </View>
        <View style={styles.timerContainerActive}>
          <Text style={styles.timerTextActive}>02:15</Text>
        </View>
      </View>
      
      {/* Action Suite */}
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigation.navigate('GameOver', { result: 'Defeat', eloChange: '-12' })}
        >
          <Text style={styles.actionButtonText}>Resign</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Draw</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Flip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
      
      {/* Move History Overlay Placeholder */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Move History</Text>
        <Text style={styles.historyContent}>1. e4 e5  2. Nf3 Nc6  3. Bb5 a6</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 64,
  },
  playerCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainer,
    padding: 12,
    borderRadius: 16,
    marginBottom: 24,
  },
  playerCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainer,
    padding: 12,
    borderRadius: 16,
    marginTop: 24,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceBright,
    marginRight: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  playerElo: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  timerContainer: {
    marginLeft: 'auto',
    backgroundColor: Colors.surfaceContainerHigh,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
  },
  timerContainerActive: {
    marginLeft: 'auto',
    backgroundColor: Colors.tertiary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  timerTextActive: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.onTertiary,
  },
  boardContainer: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  square: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  historyContainer: {
    marginTop: 32,
    backgroundColor: Colors.surfaceContainerLow,
    padding: 16,
    borderRadius: 16,
  },
  historyTitle: {
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  historyContent: {
    color: Colors.onSurface,
    fontSize: 14,
    fontFamily: 'monospace',
  },
});

export default ChessBoardScreen;
