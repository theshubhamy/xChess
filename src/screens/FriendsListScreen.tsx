import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, UserPlus, MessageCircle, Play, MoreVertical, X, ChevronLeft } from 'lucide-react-native';
import { Colors } from '../theme/colors';

const FriendsListScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState('');

  const renderFriend = ({ item }: any) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.glassFriendCard}>
      <View style={styles.avatarContainer}>
        <View style={styles.miniAvatar} />
        <View style={[styles.statusDot, item.online && styles.statusOnline]} />
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendStatus}>{item.online ? 'Playing Blitz Arena' : 'Last seen 2h ago'}</Text>
      </View>
      <View style={styles.friendActions}>
        <TouchableOpacity style={styles.actionIcon}>
          <MessageCircle size={18} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionIcon}>
          <Play size={18} color={Colors.tertiary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={Colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CHESS ALLIES</Text>
          <TouchableOpacity>
            <UserPlus size={22} color={Colors.tertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.glassSearchBar}>
            <Search size={18} color={Colors.onSurfaceVariant} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search grandmasters..."
              placeholderTextColor={Colors.surfaceContainerHighest}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <X size={16} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={[
            { id: '1', name: 'Magnus_C', online: true },
            { id: '2', name: 'Hikaru_N', online: true },
            { id: '3', name: 'Vishy_A', online: false },
            { id: '4', name: 'Alireza_F', online: false },
          ]}
          renderItem={renderFriend}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 2,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  glassSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: Colors.onSurface,
    fontSize: 15,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  glassFriendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  miniAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  statusOnline: {
    backgroundColor: '#4ade80',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  friendStatus: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  friendActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FriendsListScreen;
