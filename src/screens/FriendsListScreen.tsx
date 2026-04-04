import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, Check, UserPlus, ChevronLeft } from 'lucide-react-native';
import { Colors } from '../theme/colors';

const friends = [
  { id: '1', name: 'Grandmaster_Vance', elo: '2150 ELO', online: true },
  { id: '2', name: 'Ethereal_Queen', elo: '1985 ELO', online: true },
  { id: '3', name: 'Checkmate_Guru', elo: '1820 ELO', online: false },
];

const FriendsListScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState('');

  const online = friends.filter(f => f.online);
  const offline = friends.filter(f => !f.online);

  const renderOnlineFriend = ({ item }: any) => (
    <View style={styles.friendCard}>
      <View style={styles.friendLeft}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar} />
          <View style={styles.onlineDot} />
        </View>
        <View>
          <Text style={styles.friendName}>{item.name}</Text>
          <Text style={styles.friendElo}>{item.elo}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.inviteBtn}>
        <Text style={styles.inviteBtnText}>INVITE</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOfflineFriend = ({ item }: any) => (
    <View style={[styles.friendCard, styles.offlineCard]}>
      <View style={styles.friendLeft}>
        <View style={styles.avatarWrap}>
          <View style={[styles.avatar, styles.offlineAvatar]} />
        </View>
        <View>
          <Text style={styles.friendName}>{item.name}</Text>
          <Text style={styles.friendEloMuted}>{item.elo}</Text>
        </View>
      </View>
      <Text style={styles.lastSeenText}>3H AGO</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Top Nav */}
      <View style={styles.topNav}>
        <View style={styles.topNavLeft}>
          <View style={styles.avatarSmall} />
          <Text style={styles.brandText}>xChess</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color={Colors.onSurface} />
        </TouchableOpacity>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.content}>
          {/* Search Section */}
          <View style={styles.glassSearch}>
            <Search size={20} color={Colors.onSurfaceVariant} />
            <TextInput
              style={styles.searchInput}
              placeholder="Find Grandmasters"
              placeholderTextColor="rgba(197, 198, 205, 0.5)"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <X size={16} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            )}
          </View>

          {/* Online Section */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>ONLINE</Text>
              <View style={styles.onlinePulse} />
            </View>
            {online.map(item => (
              <View key={item.id} style={styles.friendCard}>
                <View style={styles.friendLeft}>
                  <View style={styles.avatarWrap}>
                    <View style={[styles.avatar, styles.goldBorder]} />
                    <View style={styles.onlineDot} />
                  </View>
                  <View>
                    <Text style={styles.friendName}>{item.name}</Text>
                    <Text style={styles.friendElo}>{item.elo}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.inviteBtn}>
                  <Text style={styles.inviteBtnText}>INVITE</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Offline Section */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>OFFLINE</Text>
            </View>
            <View style={styles.offlineGroup}>
              {offline.map(item => (
                <View key={item.id} style={[styles.friendCard, styles.offlineCard]}>
                  <View style={styles.friendLeft}>
                    <View style={styles.avatarWrap}>
                      <View style={[styles.avatar, styles.grayscaleAvatar]} />
                    </View>
                    <View>
                      <Text style={styles.friendName}>{item.name}</Text>
                      <Text style={styles.friendEloMuted}>{item.elo}</Text>
                    </View>
                  </View>
                  <Text style={styles.lastSeenText}>3H AGO</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Pending Requests Section */}
          <View style={styles.sectionBlock}>
            <Text style={styles.pendingLabel}>PENDING REQUESTS</Text>
            <View style={styles.pendingCard}>
              <View style={styles.friendLeft}>
                <View style={styles.avatarWrap}>
                  <View style={styles.avatar} />
                </View>
                <View>
                  <Text style={styles.friendName}>Sicilian_Slayer</Text>
                  <Text style={styles.challengeText}>sent you a challenge</Text>
                </View>
              </View>
              <View style={styles.requestActions}>
                <TouchableOpacity style={styles.rejectBtn}>
                  <X size={18} color={Colors.error} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptBtn}>
                  <Check size={18} color={Colors.onTertiary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
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
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    paddingTop: 52,
    backgroundColor: Colors.background,
  },
  topNavLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.2)',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '900',
    fontStyle: 'italic',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 16,
    gap: 24,
  },
  glassSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(45, 52, 73, 0.4)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    height: 52,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.onSurface,
    fontWeight: '600',
  },
  sectionBlock: {
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  onlinePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  pendingLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  offlineCard: {
    opacity: 0.6,
    backgroundColor: Colors.surfaceContainerLow,
  },
  offlineGroup: {
    gap: 10,
  },
  friendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  goldBorder: {
    borderWidth: 2,
    borderColor: Colors.tertiary,
  },
  grayscaleAvatar: {
    opacity: 0.5,
  },
  offlineAvatar: {
    opacity: 0.5,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2.5,
    borderColor: Colors.surfaceContainerHigh,
  },
  friendName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.onSurface,
    letterSpacing: -0.2,
  },
  friendElo: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.tertiary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 3,
  },
  friendEloMuted: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 3,
  },
  inviteBtn: {
    backgroundColor: 'rgba(234, 195, 74, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  inviteBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  lastSeenText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(45, 52, 73, 0.5)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.1)',
    borderRadius: 20,
    padding: 18,
  },
  challengeText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 3,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 10,
  },
  rejectBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(234, 195, 74, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FriendsListScreen;
