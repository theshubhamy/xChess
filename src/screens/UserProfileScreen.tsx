import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Award, Star, Trophy, Target, Settings, LogOut, Shield, Bell, User } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { logout, getCurrentUser, getUserProfile, PROFILE_ICONS, updateProfileIcon } from '../services/auth';
import { ProfileAvatar } from '../components/ProfileAvatar';
import * as Icons from 'lucide-react-native';
import { Modal } from 'react-native';

const UserProfileScreen = ({ navigation }: any) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  const [showIconPicker, setShowIconPicker] = useState(false);
  const [updatingIcon, setUpdatingIcon] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = getUserProfile(user.uid, (profile) => {
      setUserProfile(profile);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    await logout();
    setSigningOut(false);
  };

  const handleIconSelect = async (icon: string) => {
    const user = getCurrentUser();
    const uid = userProfile?.id || user?.uid;
    if (!uid) return;

    setUpdatingIcon(true);
    const { error } = await updateProfileIcon(uid, icon);
    if (!error) {
      setShowIconPicker(false);
    }
    setUpdatingIcon(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.tertiary} />
      </View>
    );
  }

  const statsList = [
    { label: 'WINS', value: userProfile?.wins?.toString() || '0', color: Colors.tertiary },
    { label: 'LOSSES', value: userProfile?.losses?.toString() || '0', color: Colors.onSurface },
    { label: 'DRAWS', value: userProfile?.draws?.toString() || '0', color: Colors.onSurface },
    { label: 'ELO RATING', value: userProfile?.elo?.toString() || '1200', color: Colors.tertiary },
  ];

  const boardPrefs = [
    { label: 'Classic Board', sub: 'Active Theme', active: true },
    { label: 'Steel & Glass Board', sub: 'Metallic Aesthetic', active: false },
  ];

  const settingsItems = [
    { label: 'Account Management', icon: User, value: 'info' },
    { label: 'Security', icon: Shield, value: 'security' },
    { label: 'Notifications', icon: Bell, value: 'notif' },
    { label: 'App Settings', icon: Settings, value: 'settings' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Profile Header */}
          <TouchableOpacity
            style={styles.profileHero}
            onPress={() => setShowIconPicker(true)}
            activeOpacity={0.8}
          >
            <View style={styles.avatarContainer}>
              <ProfileAvatar
                iconName={userProfile?.photoURL}
                size={64}
                containerSize={120}
                isGold={userProfile?.rank === 'Grandmaster'}
              />
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>{userProfile?.rank}</Text>
              </View>
            </View>

            <View style={styles.heroText}>
              <Text style={styles.profileName}>{userProfile?.username || 'Grandmaster Candidate'}</Text>
              <Text style={styles.profileRank}>{userProfile?.rank || 'Novice'} • Member since 2024</Text>
            </View>
          </TouchableOpacity>

          {/* Stats Grid — 2x2 Bento */}
          <View style={styles.statsSection}>
            <View style={styles.statsGrid}>
              {statsList.map((stat, i) => (
                <View key={i} style={styles.statCard}>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Board Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BOARD PREFERENCES</Text>
            <View style={styles.prefsList}>
              {boardPrefs.map((pref, i) => (
                <TouchableOpacity key={i} style={styles.prefRow}>
                  <View style={styles.prefInfo}>
                    <Text style={styles.prefLabel}>{pref.label}</Text>
                    <Text style={styles.prefSub}>{pref.sub}</Text>
                  </View>
                  <View style={[styles.radio, pref.active && styles.radioActive]}>
                    {pref.active && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Settings List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SETTINGS</Text>
            <View style={styles.settingsList}>
              {settingsItems.map((item, i) => (
                <TouchableOpacity key={i} style={styles.settingRow}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIconWrapper}>
                      <item.icon size={18} color={Colors.primary} />
                    </View>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                  </View>
                  <ChevronRight size={18} color={Colors.outline} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sign Out */}
          <View style={styles.signOutSection}>
            <TouchableOpacity
              style={[styles.signOutBtn, signingOut && { opacity: 0.6 }]}
              onPress={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? (
                <ActivityIndicator size="small" color={Colors.onSurfaceVariant} />
              ) : (
                <>
                  <LogOut size={20} color={Colors.onSurfaceVariant} />
                  <Text style={styles.signOutText}>SIGN OUT</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.versionText}>xCHESS VERSION 4.b10—MIDNIGHT</Text>
        </ScrollView>
      </SafeAreaView>

      {/* Icon Picker Modal */}
      <Modal
        visible={showIconPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowIconPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>CHOOSE AVATAR</Text>
              <TouchableOpacity onPress={() => setShowIconPicker(false)}>
                <Icons.X size={24} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.iconGrid}
              showsVerticalScrollIndicator={false}
            >
              {PROFILE_ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconItem,
                    userProfile?.photoURL === icon && styles.iconItemActive
                  ]}
                  onPress={() => handleIconSelect(icon)}
                  disabled={updatingIcon}
                >
                  <ProfileAvatar iconName={icon} size={28} containerSize={56} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: Colors.background,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.surfaceContainer,
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
    fontSize: 14,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
  },
  avatarRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  /* Hero */
  profileHero: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: Colors.surfaceContainerLow,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.surfaceContainer,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarGoldRing: {
    width: 140,
    height: 140,
    borderRadius: 40,
    borderWidth: 2,
    padding: 0,
    borderColor: 'rgba(234, 195, 74, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(234, 195, 74, 0.04)',
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: Colors.tertiary,
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
  },
  proBadge: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: Colors.tertiary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'center',
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onTertiary,
    letterSpacing: 1,
  },
  heroText: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -1,
    marginBottom: 4,
  },
  profileRank: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    opacity: 0.8,
  },
  /* Stats Grid */
  statsSection: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12, // Use rowGap for explicit vertical spacing
  },
  statCard: {
    width: '48.5%', // More precise width for 2 columns with spacing
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 24,
    padding: 20,
    justifyContent: 'center',
    marginBottom: 0, // Handled by rowGap
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.5,
  },
  /* Sections */
  section: {
    paddingHorizontal: 20,
    marginTop: 8, // Added safety margin from section above
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2.5,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  prefsList: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 24,
    overflow: 'hidden',
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(69, 71, 76, 0.15)',
  },
  prefInfo: {
    flex: 1,
  },
  prefLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.onSurface,
    marginBottom: 2,
  },
  prefSub: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    opacity: 0.6,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(69, 71, 76, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: Colors.tertiary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.tertiary,
  },
  /* Settings List */
  settingsList: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 24,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(69, 71, 76, 0.15)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1, // Ensure it fills space and pushes ChevronRight to the edge
  },
  settingIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '700',
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
    fontSize: 13,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '700',
    color: Colors.outline,
    letterSpacing: 1.5,
    marginTop: 10,
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: '60%',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  iconItem: {
    opacity: 0.6,
  },
  iconItemActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
});

export default UserProfileScreen;
