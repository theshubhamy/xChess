import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Edit2, Share2, Award, Zap, Target, Clock, ChevronRight } from 'lucide-react-native';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const UserProfileScreen = () => {
  const renderStat = (label: string, value: string, Icon: any, color: string) => (
    <View style={styles.glassStat}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        <Icon size={18} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.iconBtn}>
                <Share2 size={20} color={Colors.onSurface} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <Settings size={20} color={Colors.onSurface} />
              </TouchableOpacity>
            </View>

            <View style={styles.profileHero}>
              <View style={styles.avatarWrapper}>
                <View style={styles.glassAvatar}>
                  <View style={styles.avatarInner} />
                </View>
                <TouchableOpacity style={styles.editBadge}>
                  <Edit2 size={12} color={Colors.onTertiary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.profileName}>Grandmaster Vance</Text>
              <View style={styles.rankBadge}>
                <Text style={styles.rankTitle}>DIAMOND TIER I</Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statsRow}>
                {renderStat('ELO RATING', '2150', Award, Colors.tertiary)}
                {renderStat('WIN RATE', '64%', Target, Colors.primary)}
              </View>
              <View style={styles.statsRow}>
                {renderStat('TOTAL DUELS', '1,242', Zap, Colors.secondary)}
                {renderStat('AVG TIME', '12m', Clock, Colors.onSurfaceVariant)}
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>HALL OF ACHIEVEMENTS</Text>
              <TouchableOpacity><Text style={styles.seeAll}>SEE ALL</Text></TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementScroll}>
              {[1, 2, 3, 4].map((_, i) => (
                <View key={i} style={styles.glassAchievement}>
                  <Award size={32} color={Colors.tertiary} />
                  <Text style={styles.achTitle}>Elite Tactician</Text>
                  <Text style={styles.achSub}>100 puzzles solved</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>RECENT DUELS</Text>
            </View>

            <View style={styles.duelList}>
              {[1, 2, 3].map((_, i) => (
                <TouchableOpacity key={i} style={styles.glassDuelCard}>
                  <View style={styles.duelInfo}>
                    <Text style={styles.opponentName}>Magnus_C (2860)</Text>
                    <Text style={styles.duelMeta}>Rapid · 12m ago</Text>
                  </View>
                  <View style={styles.duelResult}>
                    <Text style={styles.resultValue}>+18</Text>
                    <ChevronRight size={16} color={Colors.surfaceContainerHighest} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
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
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  glassAvatar: {
    width: 110,
    height: 110,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 6,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 29,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: Colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.onSurface,
    marginBottom: 6,
  },
  rankBadge: {
    backgroundColor: 'rgba(234, 195, 74, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(234, 195, 74, 0.2)',
  },
  rankTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 2,
  },
  statsGrid: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  glassStat: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.onSurface,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 3,
  },
  seeAll: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 1,
  },
  achievementScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    gap: 12,
    marginBottom: 32,
  },
  glassAchievement: {
    width: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  achTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.onSurface,
    marginTop: 12,
    textAlign: 'center',
  },
  achSub: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'center',
  },
  duelList: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 40,
  },
  glassDuelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  duelInfo: {
    flex: 1,
  },
  opponentName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  duelMeta: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  duelResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#4ade80',
  },
});

export default UserProfileScreen;
