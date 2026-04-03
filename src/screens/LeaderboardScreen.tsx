import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar, SafeAreaView, Image } from 'react-native';
import { Medal, Trophy, Star, ChevronUp, ChevronDown } from 'lucide-react-native';
import { Colors } from '../theme/colors';

const LeaderboardScreen = () => {
  const renderPodium = (name: string, elo: string, rank: number) => {
    const isFirst = rank === 1;
    return (
      <View style={[styles.podiumItem, isFirst && styles.podiumFirst]}>
        <View style={styles.avatarWrapper}>
          <View style={[styles.glassPodiumAvatar, isFirst && styles.avatarFirst]}>
            <View style={styles.avatarInner} />
          </View>
          <View style={[styles.rankCircle, isFirst && styles.rankCircleFirst]}>
            <Text style={styles.rankText}>{rank}</Text>
          </View>
        </View>
        <Text style={styles.podiumName}>{name.toUpperCase()}</Text>
        <Text style={styles.podiumElo}>{elo} ELO</Text>
      </View>
    );
  };

  const renderRankItem = ({ item }: any) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.glassRankCard}>
      <View style={styles.rankLeft}>
        <Text style={styles.rankNumber}>{item.rank}</Text>
        <View style={styles.miniAvatar} />
        <View>
          <Text style={styles.rankName}>{item.name}</Text>
          <Text style={styles.rankTier}>{item.tier}</Text>
        </View>
      </View>
      <View style={styles.rankRight}>
        <Text style={styles.rankValue}>{item.elo}</Text>
        {item.trend === 'up' ? (
          <ChevronUp size={16} color="#4ade80" />
        ) : (
          <ChevronDown size={16} color="#f87171" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>GLOBAL LEADERS</Text>
            <Trophy size={20} color={Colors.tertiary} />
          </View>

          <View style={styles.podiumSection}>
            {renderPodium('Hikaru_N', '2940', 2)}
            {renderPodium('Magnus_C', '3120', 1)}
            {renderPodium('Alireza_F', '2895', 3)}
          </View>

          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>GRANDMASTER RANKINGS</Text>
            </View>
            <FlatList
              data={[
                { rank: 4, name: 'Nepo_Ian', elo: 2850, tier: 'Grandmaster', trend: 'down' },
                { rank: 5, name: 'Anish_Giri', elo: 2835, tier: 'Grandmaster', trend: 'up' },
                { rank: 6, name: 'Ding_Liren', elo: 2810, tier: 'Grandmaster', trend: 'up' },
                { rank: 7, name: 'Pragg_R', elo: 2795, tier: 'International Master', trend: 'up' },
                { rank: 8, name: 'Gukesh_D', elo: 2780, tier: 'International Master', trend: 'up' },
              ]}
              renderItem={renderRankItem}
              keyExtractor={item => item.rank.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </View>

          <View style={styles.bottomHighlight}>
            <View style={styles.glassUserRank}>
              <View style={styles.myRankInfo}>
                <Text style={styles.myRankNumber}>#1,242</Text>
                <View style={styles.myAvatar} />
                <Text style={styles.myName}>Grandmaster Vance</Text>
              </View>
              <Text style={styles.myElo}>2150</Text>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 2,
  },
  podiumSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 220,
    paddingBottom: 20,
  },
  podiumItem: {
    alignItems: 'center',
    width: width / 3.5,
  },
  podiumFirst: {
    width: width / 3,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  glassPodiumAvatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 4,
  },
  avatarFirst: {
    width: 84,
    height: 84,
    borderColor: Colors.tertiary,
    backgroundColor: 'rgba(234, 195, 74, 0.1)',
  },
  avatarInner: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  rankCircle: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankCircleFirst: {
    backgroundColor: Colors.tertiary,
    borderColor: Colors.tertiary,
  },
  rankText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onSurface,
  },
  podiumName: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  podiumElo: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontWeight: '700',
  },
  listSection: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  listHeader: {
    padding: 24,
  },
  listTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 100,
  },
  glassRankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    width: 24,
  },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  rankName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  rankTier: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  rankRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankValue: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.onSurface,
  },
  bottomHighlight: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  glassUserRank: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(234, 195, 74, 0.2)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.4)',
  },
  myRankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  myRankNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.tertiary,
  },
  myAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  myName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.tertiary,
  },
  myElo: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.tertiary,
  },
});

export default LeaderboardScreen;
