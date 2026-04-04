import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Award, Star, Trophy, Target, Clock, TrendingUp, Edit2, Settings, Share2 } from 'lucide-react-native';
import { Colors } from '../theme/colors';

const UserProfileScreen = ({ navigation }: any) => {
  const stats = [
    { label: 'WINS', value: '1,432', color: Colors.tertiary },
    { label: 'LOSSES', value: '843', color: Colors.onSurface },
    { label: 'DRAWS', value: '211', color: Colors.onSurface },
    { label: 'BEST ELO', value: '2210', color: Colors.tertiary },
  ];

  const boardPrefs = [
    { label: 'Classic Board', sub: 'Active Theme', active: true },
    { label: 'Steel & Glass Board', sub: 'Metallic Aesthetic', active: false },
  ];

  const settingsItems = [
    { label: 'Account Management', icon: Settings },
    { label: 'Security', icon: Star },
    { label: 'Notifications', icon: Trophy },
    { label: 'App Settings', icon: Target },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity style={styles.menuBtn}>
            <Settings size={20} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.brandName}>xChess</Text>
        </View>
        <View style={styles.avatarRing}>
          <View style={styles.avatarPlaceholder} />
        </View>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Profile Header */}
          <View style={styles.profileHero}>
            <View style={styles.avatarContainer}>
              {/* Gold ring avatar — glass gold border */}
              <View style={styles.avatarGoldRing}>
                <View style={styles.avatarInner}>
                  <Award size={40} color={Colors.tertiary} />
                </View>
              </View>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            </View>

            <View style={styles.heroNameBlock}>
              <Text style={styles.heroName}>Grandmaster Vance</Text>
              <View style={styles.heroBadgesRow}>
                <View style={styles.eloBadge}>
                  <Star size={14} color={Colors.tertiary} />
                  <Text style={styles.eloBadgeText}>Elo 2150</Text>
                </View>
                <View style={styles.rankBadge}>
                  <Trophy size={14} color={Colors.primary} />
                  <Text style={styles.rankBadgeText}>Rank #1,242</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats Glass Grid */}
          <View style={styles.statsGrid}>
            {stats.map((stat, i) => (
              <View key={i} style={styles.statCard}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              </View>
            ))}
          </View>

          {/* Board Preferences */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>BOARD PREFERENCES</Text>
            <View style={styles.prefGrid}>
              {boardPrefs.map((pref, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.prefCard, pref.active && styles.prefCardActive]}
                  activeOpacity={0.8}
                >
                  <View style={[styles.prefIcon, pref.active && styles.prefIconActive]}>
                    <Target size={20} color={pref.active ? Colors.tertiary : Colors.primary} />
                  </View>
                  <View style={styles.prefText}>
                    <Text style={[styles.prefLabel, !pref.active && styles.prefLabelMuted]}>
                      {pref.label}
                    </Text>
                    <Text style={[styles.prefSub, { color: pref.active ? Colors.tertiary : Colors.onSurfaceVariant + '80' }]}>
                      {pref.sub}
                    </Text>
                  </View>
                  {pref.active && (
                    <Star size={18} color={Colors.tertiary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Settings List */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>SETTINGS</Text>
            <View style={styles.settingsList}>
              {settingsItems.map((item, i) => (
                <TouchableOpacity key={i} style={styles.settingsRow} activeOpacity={0.8}>
                  <View style={styles.settingsIcon}>
                    <item.icon size={20} color={Colors.primary} />
                  </View>
                  <Text style={styles.settingsLabel}>{item.label}</Text>
                  <ChevronRight size={18} color={Colors.outlineVariant} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sign Out */}
          <View style={styles.signOutSection}>
            <TouchableOpacity style={styles.signOutBtn} onPress={() => navigation.navigate('Welcome')}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    paddingTop: 52,
    backgroundColor: Colors.surfaceContainer,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 20,
    fontWeight: '900',
    fontStyle: 'italic',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  avatarRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: 'rgba(234, 195, 74, 0.3)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  scrollContent: {
    paddingBottom: 60,
    gap: 0,
  },
  /* Profile Hero */
  profileHero: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
    gap: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarGoldRing: {
    width: 128,
    height: 128,
    borderRadius: 64,
    padding: 4,
    backgroundColor: 'rgba(234, 195, 74, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(234, 195, 74, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: Colors.background,
    borderWidth: 4,
    borderColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  proBadge: {
    position: 'absolute',
    bottom: -6,
    right: -4,
    backgroundColor: Colors.tertiary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onTertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroNameBlock: {
    alignItems: 'center',
    gap: 12,
  },
  heroName: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.8,
  },
  heroBadgesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  eloBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  eloBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  rankBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  /* Stats Grid */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  statCard: {
    width: '47%',
    backgroundColor: 'rgba(34, 42, 61, 0.4)',
    borderRadius: 20,
    padding: 20,
    height: 100,
    justifyContent: 'space-between',
    // glass-card style from Stitch
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
  },
  /* Sections */
  sectionBlock: {
    paddingHorizontal: 20,
    marginBottom: 28,
    gap: 14,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    paddingHorizontal: 2,
  },
  /* Board preferences */
  prefGrid: {
    gap: 10,
  },
  prefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerLow,
    gap: 14,
  },
  prefCardActive: {
    backgroundColor: Colors.surfaceContainerHighest,
  },
  prefIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prefIconActive: {
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 2,
    borderColor: Colors.tertiary,
  },
  prefText: {
    flex: 1,
  },
  prefLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  prefLabelMuted: {
    color: Colors.onSurfaceVariant,
  },
  prefSub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
  },
  /* Settings list */
  settingsList: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 20,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(69, 71, 76, 0.15)',
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  /* Sign Out */
  signOutSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  signOutBtn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.secondaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
});

export default UserProfileScreen;
