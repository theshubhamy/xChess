import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Award, Trophy, Star, ChevronRight, Zap, Book, Clock } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { getCurrentUser, getUserProfile } from '../services/auth';

const courses = [
  { title: 'Opening Theory', duration: '12h 30m', lessons: '24 Lessons', level: 'INTERMEDIATE', progress: 0.33 },
  { title: 'Endgame Mastery', duration: '8h 15m', lessons: '15 Lessons', level: 'ADVANCED', progress: 0 },
  { title: 'Tactical Patterns', duration: '20h 45m', lessons: '42 Lessons', level: 'ALL LEVELS', progress: 0.66 },
];

const AcademyScreen = ({ navigation }: any) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const unsub = getUserProfile(user.uid, (profile) => {
      setUserProfile(profile);
      setLoading(false);
    });
    return () => unsub();
  }, []);

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
        {/* Header Section */}
        <View style={styles.pageHeader}>
          <Text style={styles.eyebrow}>MASTER THE 64 SQUARES</Text>
          <Text style={styles.pageTitle}>Academy</Text>
        </View>

        {/* Stats Bar: Progress */}
        <View style={styles.progressBar}>
          <View style={styles.progressLeft}>
            <View style={styles.progressIconWrap}>
              <Trophy size={18} color={Colors.tertiary} />
            </View>
            <View>
              <Text style={styles.progressLabel}>ELO PROGRESS</Text>
              <Text style={styles.progressValue}>{userProfile?.elo || 1200} ELO</Text>
            </View>
          </View>
          <View style={styles.progressRight}>
            <View style={styles.badgeWrap}>
              <Text style={styles.badgeText}>{userProfile?.rank?.toUpperCase() || 'NOVICE'}</Text>
            </View>
          </View>
        </View>

        {/* Daily Puzzle Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DAILY CHALLENGE</Text>
          <TouchableOpacity style={styles.heroCard}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroTag}>DAILY PUZZLE</Text>
              <Text style={styles.heroTitle}>Mastering the Catalan</Text>
              <Text style={styles.heroSub}>Find the best move to maintain an advantage in the opening.</Text>
              <View style={styles.heroBtn}>
                <Text style={styles.heroBtnText}>SOLVE NOW</Text>
                <ChevronRight size={14} color={Colors.onTertiary} />
              </View>
            </View>
            <View style={styles.heroRight}>
              <View style={styles.miniBoard}>
                <Zap size={32} color="rgba(234, 195, 74, 0.4)" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Featured Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>FEATURED COURSES</Text>
            <Text style={styles.viewAll}>SEE ALL</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.courseScroll}>
            {courses.map((course, i) => (
              <TouchableOpacity key={i} style={styles.courseCard}>
                <View style={styles.courseHeader}>
                  <View style={styles.courseIcon}>
                    <Book size={18} color={Colors.primary} />
                  </View>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{course.level}</Text>
                  </View>
                </View>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <View style={styles.metadata}>
                  <Clock size={12} color={Colors.outline} />
                  <Text style={styles.metaText}>{course.duration} • {course.lessons}</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressIndicator, { width: `${course.progress * 100}%` }]} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Master Class Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MASTER CLASSES</Text>
          <View style={styles.bentoGrid}>
            <TouchableOpacity style={styles.bentoLarge}>
              <View style={styles.bentoTag}>
                <Text style={styles.bentoTagText}>LIVE SESSION</Text>
              </View>
              <Text style={styles.bentoTitle}>GM Magnus C. Theory</Text>
              <Text style={styles.bentoSub}>Live analysis of the world championship game.</Text>
              <View style={styles.instructor}>
                <View style={styles.instructorAvatar} />
                <Text style={styles.instructorName}>MAGNUS C.</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.bentoSmallCol}>
              <TouchableOpacity style={styles.bentoSmall}>
                <Trophy size={20} color={Colors.tertiary} />
                <Text style={styles.smallBentoTitle}>Puzzles</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bentoSmall}>
                <Star size={20} color={Colors.primary} />
                <Text style={styles.smallBentoTitle}>Tactics</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingTop: 10, paddingBottom: 120 },
  pageHeader: { paddingHorizontal: 24, paddingTop: 10, marginBottom: 20 },
  eyebrow: { fontSize: 10, fontWeight: '900', color: Colors.onSurfaceVariant, letterSpacing: 3, marginBottom: 8 },
  pageTitle: { fontSize: 32, fontWeight: '900', color: Colors.onSurface, letterSpacing: -1 },
  /* Stats Bar */
  progressBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 24, padding: 20, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 28, marginBottom: 32, borderWidth: 1.5, borderColor: 'rgba(69, 71, 76, 0.15)' },
  progressLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  progressIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(234, 195, 74, 0.08)', justifyContent: 'center', alignItems: 'center' },
  progressLabel: { fontSize: 10, fontWeight: '900', color: Colors.onSurfaceVariant, letterSpacing: 2 },
  progressValue: { fontSize: 18, fontWeight: '900', color: Colors.tertiary, letterSpacing: -0.5 },
  progressRight: { flexDirection: 'row', alignItems: 'center' },
  badgeWrap: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: Colors.surfaceContainerHighest, borderWidth: 1, borderColor: 'rgba(69, 71, 76, 0.2)' },
  badgeText: { fontSize: 10, fontWeight: '900', color: Colors.onSurfaceVariant, letterSpacing: 1 },
  /* Hero */
  section: { paddingHorizontal: 24, marginBottom: 40 },
  sectionTitle: { fontSize: 12, fontWeight: '900', color: Colors.onSurfaceVariant, letterSpacing: 2.5, marginBottom: 16 },
  viewAll: { fontSize: 11, fontWeight: '900', color: Colors.tertiary, letterSpacing: 1.5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroCard: { backgroundColor: Colors.tertiary, borderRadius: 32, padding: 24, flexDirection: 'row', overflow: 'hidden' },
  heroLeft: { flex: 1.4 },
  heroTag: { fontSize: 10, fontWeight: '900', color: 'rgba(0, 0, 0, 0.5)', letterSpacing: 1.5, marginBottom: 8 },
  heroTitle: { fontSize: 24, fontWeight: '900', color: Colors.onTertiary, letterSpacing: -0.5, marginBottom: 12 },
  heroSub: { fontSize: 14, fontWeight: '600', color: 'rgba(0, 0, 0, 0.6)', lineHeight: 20, marginBottom: 20 },
  heroBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: Colors.onTertiary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14 },
  heroBtnText: { fontSize: 12, fontWeight: '900', color: Colors.tertiary, letterSpacing: 1 },
  heroRight: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  miniBoard: { width: 88, height: 88, backgroundColor: 'rgba(0, 0, 0, 0.08)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  /* Courses */
  courseScroll: { gap: 16 },
  courseCard: { width: 240, backgroundColor: Colors.surfaceContainerLow, borderRadius: 28, padding: 20, borderWidth: 1.5, borderColor: 'rgba(69, 71, 76, 0.15)' },
  courseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  courseIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.primaryContainer, justifyContent: 'center', alignItems: 'center' },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: Colors.surfaceContainerHighest },
  levelText: { fontSize: 9, fontWeight: '900', color: Colors.onSurfaceVariant, letterSpacing: 0.5 },
  courseTitle: { fontSize: 18, fontWeight: '900', color: Colors.onSurface, marginBottom: 8, letterSpacing: -0.3 },
  metadata: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  metaText: { fontSize: 11, fontWeight: '700', color: Colors.outline },
  progressTrack: { height: 6, backgroundColor: Colors.surfaceContainerHighest, borderRadius: 3, overflow: 'hidden' },
  progressIndicator: { height: '100%', backgroundColor: Colors.tertiary },
  /* Bento Grid */
  bentoGrid: { flexDirection: 'row', gap: 16 },
  bentoLarge: { flex: 1.5, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 32, padding: 24 },
  bentoTag: { backgroundColor: 'rgba(234, 195, 74, 0.12)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 16 },
  bentoTagText: { fontSize: 9, fontWeight: '900', color: Colors.tertiary, letterSpacing: 1.5 },
  bentoTitle: { fontSize: 20, fontWeight: '900', color: Colors.onSurface, letterSpacing: -0.5, marginBottom: 8 },
  bentoSub: { fontSize: 13, fontWeight: '600', color: Colors.onSurfaceVariant, opacity: 0.6, marginBottom: 20 },
  instructor: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  instructorAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surfaceContainerHighest },
  instructorName: { fontSize: 10, fontWeight: '900', color: Colors.onSurface, letterSpacing: 1.5 },
  bentoSmallCol: { flex: 1, gap: 16 },
  bentoSmall: { flex: 1, backgroundColor: Colors.surfaceContainerLow, borderRadius: 28, padding: 20, justifyContent: 'center', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: 'rgba(69, 71, 76, 0.15)' },
  smallBentoTitle: { fontSize: 13, fontWeight: '800', color: Colors.onSurfaceVariant, letterSpacing: 1.5 },
});

export default AcademyScreen;
