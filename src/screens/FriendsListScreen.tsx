import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Search, X, Check, User } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { ProfileAvatar } from '../components/ProfileAvatar';
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
    const unsubProfile = getUserProfile(currUser.uid, setMyProfile);
    const unsubFriends = getFriends(currUser.uid, setFriends);
    const unsubRequests = getFriendRequests(currUser.uid, (reqs) => {
      setRequests(reqs);
      setLoading(false);
    });
    return () => { unsubProfile(); unsubFriends(); unsubRequests(); };
  }, []);

  const handleAccept = async (req: any) => {
    if (!myProfile) return;
    const { error } = await acceptFriendRequest(currUser!.uid, req.id, req.fromName, myProfile.username);
    if (error) Alert.alert('Error', error);
    else Alert.alert('Success', `${req.fromName} added to friends.`);
  };

  const filteredFriends = friends.filter(f => f.username.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.tertiary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Page title */}
        <View style={styles.pageHeader}>
          <Text style={styles.eyebrow}>YOUR CHESS COMMUNITY</Text>
          <Text style={styles.pageTitle}>Social</Text>
        </View>

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

        {/* Requests Section */}
        {requests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PENDING REQUESTS ({requests.length})</Text>
            {requests.map(req => (
              <View key={req.id} style={styles.requestCard}>
                <View style={styles.requestLeft}>
                  <View style={styles.requestAvatar} />
                  <View>
                    <Text style={styles.requestName}>{req.fromName}</Text>
                    <Text style={styles.requestSub}>Sent you a request</Text>
                  </View>
                </View>
                <View style={styles.requestActions}>
                  <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(req)}>
                    <Check size={18} color={Colors.onTertiary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.declineBtn}><X size={18} color={Colors.onSurface} /></TouchableOpacity>
                </View>
              </View>
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
            </View>
          ) : (
            filteredFriends.map(friend => (
              <View key={friend.id} style={styles.friendCard}>
                <View style={styles.friendLeft}>
                  <View style={styles.avatarWrap}>
                    <ProfileAvatar iconName={friend.photoURL} size={22} containerSize={52} />
                    <View style={[styles.statusDot, { backgroundColor: friend.online ? '#4ADE80' : Colors.outline }]} />
                  </View>
                  <View>
                    <Text style={styles.friendName}>{friend.username}</Text>
                    <Text style={styles.friendStatus}>{friend.online ? 'Online' : 'Offline'}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.challengeBtn} onPress={() => navigation.navigate('Matchmaking', { mode: 'Blitz', challenge: friend.id })}>
                  <Text style={styles.challengeBtnText}>PLAY</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingTop: 10, paddingBottom: 110 },
  pageHeader: { paddingHorizontal: 24, paddingTop: 10, marginBottom: 20 },
  eyebrow: { fontSize: 10, fontWeight: '900', color: Colors.onSurfaceVariant, letterSpacing: 3, marginBottom: 8 },
  pageTitle: { fontSize: 32, fontWeight: '900', color: Colors.onSurface, letterSpacing: -1 },
  searchSection: { paddingHorizontal: 20, paddingVertical: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceContainerHigh, borderRadius: 16, paddingHorizontal: 16, height: 54, gap: 12 },
  searchInput: { flex: 1, color: Colors.onSurface, fontSize: 15, fontWeight: '600' },
  section: { paddingHorizontal: 20, marginBottom: 28 },
  sectionTitle: { fontSize: 10, fontWeight: '900', color: Colors.onSurfaceVariant, letterSpacing: 2, marginBottom: 16, textTransform: 'uppercase' },
  friendCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.surfaceContainerLow, padding: 16, borderRadius: 24, marginBottom: 12 },
  friendLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarWrap: { position: 'relative' },
  statusDot: { position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: 7, borderWidth: 3, borderColor: Colors.surfaceContainerLow },
  friendName: { fontSize: 16, fontWeight: '800', color: Colors.onSurface, marginBottom: 2 },
  friendStatus: { fontSize: 12, fontWeight: '600', color: Colors.onSurfaceVariant, opacity: 0.6 },
  challengeBtn: { backgroundColor: 'rgba(234, 195, 74, 0.1)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  challengeBtnText: { color: Colors.tertiary, fontWeight: '900', fontSize: 12, letterSpacing: 1 },
  requestCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.surfaceContainerHigh, padding: 16, borderRadius: 24, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: Colors.tertiary },
  requestLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  requestAvatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.surfaceContainerHighest },
  requestName: { fontSize: 15, fontWeight: '800', color: Colors.onSurface },
  requestSub: { fontSize: 11, fontWeight: '600', color: Colors.onSurfaceVariant },
  requestActions: { flexDirection: 'row', gap: 8 },
  acceptBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.tertiary, justifyContent: 'center', alignItems: 'center' },
  declineBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.surfaceContainerHighest, justifyContent: 'center', alignItems: 'center' },
  emptyState: { alignItems: 'center', paddingVertical: 40, opacity: 0.5 },
  emptyText: { fontSize: 18, fontWeight: '800', color: Colors.onSurface, marginTop: 16 },
});

export default FriendsListScreen;
