import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, Trophy, Star, ChevronRight, Zap, Book, Clock } from 'lucide-react-native';
import { Colors } from '../theme/colors';

const courses = [
  {
    title: 'Opening Theory',
    duration: '12h 30m',
    lessons: '24 Lessons',
    level: 'INTERMEDIATE',
    progress: 0.33,
  },
  {
    title: 'Endgame Mastery',
    duration: '8h 15m',
    lessons: '15 Lessons',
    level: 'ADVANCED',
    progress: 0,
  },
  {
    title: 'Tactical Patterns',
    duration: '20h 45m',
    lessons: '42 Lessons',
    level: 'ALL LEVELS',
    progress: 0.66,
  },
];

const AcademyScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.profilePic}>
            <Award size={20} color={Colors.tertiary} />
          </View>
          <Text style={styles.brandName}>xChess Academy</Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn}>
          <Star size={20} color={Colors.onSurface} />
        </TouchableOpacity>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
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
                <TrendingUpIcon />
              </View>
              <View>
                <Text style={styles.progressLabel}>ELO CHANGE</Text>
                <Text style={styles.progressValue}>+15 today</Text>
              </View>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressRight}>
              <Text style={styles.progressLabel}>DAILY GOAL</Text>
              <Text style={styles.progressValueSecondary}>3 lessons completed</Text>
            </View>
          </View>

          {/* Hero: Daily Puzzle */}
          <View style={styles.puzzleHero}>
            <View style={styles.puzzleLeft}>
              <View style={styles.puzzleBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.puzzleBadgeText}>Daily Puzzle</Text>
              </View>
              <Text style={styles.puzzleTitle}>MATE IN THREE</Text>
              <Text style={styles.puzzleSub}>
                Find the winning sequence for White. 1.2k players solved today.
              </Text>
              <TouchableOpacity style={styles.solveBtn}>
                <Text style={styles.solveBtnText}>SOLVE NOW</Text>
              </TouchableOpacity>
            </View>

            {/* Mini chess board visualization */}
            <View style={styles.miniBoardWrap}>
              <View style={styles.miniBoard}>
                {[0, 1, 2, 3].map(row =>
                  [0, 1, 2, 3].map(col => {
                    const isDark = (row + col) % 2 === 1;
                    return (
                      <View
                        key={`${row}-${col}`}
                        style={[
                          styles.miniSquare,
                          isDark ? styles.darkSquare : styles.lightSquare,
                        ]}
                      />
                    );
                  })
                )}
              </View>
            </View>
          </View>

          {/* Courses Section */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>COURSES</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.courseScroll}
          >
            {courses.map((course, i) => (
              <View key={i} style={styles.courseCard}>
                {/* Thumbnail placeholder */}
                <View style={styles.courseThumbnail}>
                  <View style={styles.thumbnailOverlay} />
                  <View style={styles.levelChip}>
                    <Text style={styles.levelChipText}>{course.level}</Text>
                  </View>
                </View>
                <View style={styles.courseBody}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <View style={styles.courseMeta}>
                    <View style={styles.metaItem}>
                      <Clock size={12} color={Colors.onSurfaceVariant} />
                      <Text style={styles.metaText}>{course.duration}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Book size={12} color={Colors.onSurfaceVariant} />
                      <Text style={styles.metaText}>{course.lessons}</Text>
                    </View>
                  </View>
                  {/* Progress bar */}
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${course.progress * 100}%` }]} />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Master Classes Bento Grid */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>MASTER CLASSES</Text>
          </View>

          <View style={styles.bentoGrid}>
            <View style={styles.bentoCard}>
              <Award size={36} color={Colors.tertiary} />
              <Text style={styles.bentoTitle}>The Karpov Strategy</Text>
              <Text style={styles.bentoSub}>LIVE LESSON</Text>
            </View>
            <View style={styles.bentoCard}>
              <Zap size={36} color={Colors.tertiary} />
              <Text style={styles.bentoTitle}>Engine Analysis</Text>
              <Text style={styles.bentoSub}>VIDEO SERIES</Text>
            </View>
            {/* Instructor featured tutor */}
            <View style={styles.tutorCard}>
              <View style={styles.tutorAvatar}>
                <Trophy size={28} color={Colors.tertiary} />
              </View>
              <View style={styles.tutorInfo}>
                <Text style={styles.tutorEyebrow}>FEATURED TUTOR</Text>
                <Text style={styles.tutorName}>GM Elena Volkov</Text>
                <Text style={styles.tutorBio}>Positional sacrifice expert.</Text>
              </View>
              <ChevronRight size={20} color={Colors.onSurfaceVariant} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// Inline icon component
const TrendingUpIcon = () => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Zap size={28} color={Colors.tertiary} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  safeArea: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 14,
    paddingTop: 52,
    backgroundColor: 'rgba(11, 19, 38, 0.8)',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.2)',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'italic',
    color: Colors.tertiary,
    letterSpacing: -0.5,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  /* Page Header */
  pageHeader: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 4,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.tertiary,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  pageTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -1.5,
  },
  /* Progress Stats Bar */
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 18,
    padding: 18,
  },
  progressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  progressIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.tertiary,
  },
  progressValueSecondary: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  progressDivider: {
    width: 1.5,
    height: 40,
    backgroundColor: 'rgba(69, 71, 76, 0.2)',
    marginHorizontal: 16,
  },
  progressRight: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  /* Daily Puzzle Hero */
  puzzleHero: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 28,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 24,
    overflow: 'hidden',
  },
  puzzleLeft: {
    flex: 1,
    padding: 22,
    gap: 12,
    justifyContent: 'space-between',
  },
  puzzleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(234, 195, 74, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.2)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.tertiary,
  },
  puzzleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.tertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  puzzleTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -1,
    lineHeight: 30,
  },
  puzzleSub: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
    maxWidth: 160,
  },
  solveBtn: {
    backgroundColor: 'rgba(234, 195, 74, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.35)',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  solveBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  /* Mini chess board */
  miniBoardWrap: {
    width: 130,
    backgroundColor: Colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  miniBoard: {
    width: 96,
    height: 96,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 4,
    overflow: 'hidden',
  },
  miniSquare: {
    width: 24,
    height: 24,
  },
  darkSquare: {
    backgroundColor: Colors.surfaceContainerHighest,
  },
  lightSquare: {
    backgroundColor: '#d8e3fb',
    opacity: 0.8,
  },
  /* Courses */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    marginBottom: 16,
  },
  sectionHeader: {
    paddingHorizontal: 22,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.3,
  },
  viewAll: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.tertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  courseScroll: {
    paddingHorizontal: 20,
    paddingRight: 10,
    gap: 14,
    marginBottom: 28,
  },
  courseCard: {
    width: 260,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(69, 71, 76, 0.1)',
  },
  courseThumbnail: {
    height: 110,
    backgroundColor: Colors.surfaceContainer,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  thumbnailOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: Colors.surfaceContainerLow,
    opacity: 0.8,
  },
  levelChip: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    backgroundColor: 'rgba(11, 19, 38, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  levelChipText: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  courseBody: {
    padding: 18,
    gap: 10,
  },
  courseTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.onSurface,
    lineHeight: 22,
  },
  courseMeta: {
    flexDirection: 'row',
    gap: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.tertiary,
    borderRadius: 2,
  },
  /* Master Classes Bento */
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  bentoCard: {
    width: '47%',
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 22,
    padding: 22,
    aspectRatio: 1,
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'rgba(69, 71, 76, 0.05)',
  },
  bentoTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.onSurface,
    lineHeight: 20,
  },
  bentoSub: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tutorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 22,
    padding: 20,
    gap: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(69, 71, 76, 0.05)',
  },
  tutorAvatar: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.2)',
  },
  tutorInfo: {
    flex: 1,
    gap: 4,
  },
  tutorEyebrow: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tutorName: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.5,
  },
  tutorBio: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 17,
  },
});

export default AcademyScreen;
