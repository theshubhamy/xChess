import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, StatusBar, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, Check, UserPlus, ChevronLeft, User } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { getCurrentUser, getFriends, getFriendRequests, acceptFriendRequest, getUserProfile } from '../services/auth';

const FriendsListScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [myProfile, setMyProfile] = useState<any>(null);

  const currUser = getCurrentUser();

  useEffect(() => {
    if (!currUser) return;

    setLoading(true);

    // Get my profile for accepting requests (to share my name back)
    const unsubProfile = getUserProfile(currUser.uid, setMyProfile);

    // Listen to friends
    const unsubFriends = getFriends(currUser.uid, (data) => {
      setFriends(data);
    });

    // Listen to requests
    const unsubRequests = getFriendRequests(currUser.uid, (reqs) => {
      setRequests(reqs);
      setLoading(false);
    });

    return () => {
      unsubProfile();
      unsubFriends();
      unsubRequests();
    };
  }, []);

  const handleAccept = async (req: any) => {
    if (!myProfile) return;
    const { error } = await acceptFriendRequest(currUser!.uid, req.id, req.fromName, myProfile.username);
    if (error) Alert.alert('Error', error);
    else Alert.alert('Success', `${req.fromName} added to friends.`);
  };

  const filteredFriends = friends.filter(f => 
    f.username.toLowerCase().includes(search.toLowerCase())
  );

  const renderFriend = ({ item }: any) => (
    <View style={styles.friendCard}>
      <View style={styles.friendLeft}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <User size={24} color={Colors.outline} />
          </View>
          <View style={[styles.statusDot, { backgroundColor: item.online ? '#4ADE80' : Colors.outline }]} />
        </View>
        <View>
          <Text style={styles.friendName}>{item.username}</Text>
          <Text style={styles.friendStatus}>{item.online ? 'Online' : 'Offline'}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.challengeBtn}
        onPress={() => navigation.navigate('Matchmaking', { mode: 'Blitz', challenge: item.id })}
      >
        <Text style={styles.challengeBtnText}>PLAY</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRequest = ({ item }: any) => (
    <View style={styles.requestCard}>
      <View style={styles.requestLeft}>
        <View style={styles.requestAvatar} />
        <View>
          <Text style={styles.requestName}>{item.fromName}</Text>
          <Text style={styles.requestSub}>Sent you a request</Text>
        </View>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item)}>
          <Check size={18} color={Colors.onTertiary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.declineBtn}>
          <X size={18} color={Colors.onSurface} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.tertiary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Nav */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>SOCIAL</Text>
        <TouchableOpacity style={styles.addBtn}>
          <UserPlus size={22} color={Colors.tertiary} />
        </TouchableOpacity>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.outline} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search friends..."
              placeholderTextColor={Colors.outline}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Requests Section */}
          {requests.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PENDING REQUESTS ({requests.length})</Text>
              {requests.map(req => (
                <View key={req.id}>{renderRequest({ item: req })}</View>
              ))}
            </View>
          )}

          {/* Friends Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FRIENDS ({filteredFriends.length})</Text>
            {filteredFriends.length === 0 ? (
              <View style={styles.emptyState}>
                <User size={48} color={Colors.surfaceContainerHighest} />
                <Text style={styles.emptyText}>No friends yet.</Text>
                <Text style={styles.emptySub}>Add users from the leaderboard to play together.</Text>
              </View>
            ) : (
              filteredFriends.map(friend => (
                <View key={friend.id}>{renderFriend({ item: friend })}</View>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { justifyContent: 'center', alignItems: 'center' },
  safeArea: { flex: 1 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1.5, borderBottomColor: Colors.surfaceContainer },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center' },
  navTitle: { fontSize: 13, fontWeight: '900', color: Colors.onSurfaceVariant, letterSpacing: 2 },
  addBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(234, 195, 74, 0.08)', justifyContent: 'center', alignItems: 'center' },
  searchSection: { paddingHorizontal: 20, paddingVertical: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceContainerHigh, borderRadius: 16, paddingHorizontal: 16, height: 54, gap: 12 },
  searchInput: { flex: 1, color: Colors.onSurface, fontSize: 15, fontWeight: '600' },
  scrollContent: { paddingBottom: 40 },
  section: { paddingHorizontal: 20, marginBottom: 28 },
  sectionTitle: { fontSize: 10, fontWeight: '900', color: Colors.onSurfaceVariant, letterSpacing: 2, marginBottom: 16, textTransform: 'uppercase' },
  /* Card */
  friendCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.surfaceContainerLow, padding: 16, borderRadius: 24, marginBottom: 12 },
  friendLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 52, height: 52, borderRadius: 18, backgroundColor: Colors.surfaceContainerHighest, justifyContent: 'center', alignItems: 'center' },
  statusDot: { position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: 7, borderWidth: 3, borderColor: Colors.surfaceContainerLow },
  friendName: { fontSize: 16, fontWeight: '800', color: Colors.onSurface, marginBottom: 2 },
  friendStatus: { fontSize: 12, fontWeight: '600', color: Colors.onSurfaceVariant, opacity: 0.6 },
  challengeBtn: { backgroundColor: 'rgba(234, 195, 74, 0.1)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(234, 195, 74, 0.2)' },
  challengeBtnText: { color: Colors.tertiary, fontWeight: '900', fontSize: 12, letterSpacing: 1 },
  /* Requests */
  requestCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.surfaceContainerHigh, padding: 16, borderRadius: 24, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: Colors.tertiary },
  requestLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  requestAvatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.surfaceContainerHighest },
  requestName: { fontSize: 15, fontWeight: '800', color: Colors.onSurface },
  requestSub: { fontSize: 11, fontWeight: '600', color: Colors.onSurfaceVariant },
  requestActions: { flexDirection: 'row', gap: 8 },
  acceptBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.tertiary, justifyContent: 'center', alignItems: 'center' },
  declineBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.surfaceContainerHighest, justifyContent: 'center', alignItems: 'center' },
  /* Empty State */
  emptyState: { alignItems: 'center', paddingVertical: 40, opacity: 0.5 },
  emptyText: { fontSize: 18, fontWeight: '800', color: Colors.onSurface, marginTop: 16 },
  emptySub: { fontSize: 13, color: Colors.onSurfaceVariant, textAlign: 'center', marginTop: 8, paddingHorizontal: 40 },
});

export default FriendsListScreen;
