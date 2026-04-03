import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Award, Target, Zap, ChevronRight, PlayCircle } from 'lucide-react-native';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const AcademyScreen = () => {
  const renderCourse = (title: string, lessons: string, progress: number, Icon: any, color: string) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.glassCourseCard}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Icon size={24} color={color} />
      </View>
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{title.toUpperCase()}</Text>
        <Text style={styles.courseSub}>{lessons} LESSONS · {progress}% COMPLETE</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: color }]} />
        </View>
      </View>
      <ChevronRight size={18} color={Colors.surfaceContainerHighest} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>GRANDMASTER ACADEMY</Text>
              <Award size={22} color={Colors.tertiary} />
            </View>

            <View style={styles.heroSection}>
              <View style={styles.glassHeroCard}>
                <View style={styles.heroTextContent}>
                  <Text style={styles.heroLabel}>ENROLLMENT ACTIVE</Text>
                  <Text style={styles.heroTitle}>Master the Openings</Text>
                  <Text style={styles.heroSubtext}>Learn the Ruy Lopez and Sicilian Defense from the elite.</Text>
                  <TouchableOpacity style={styles.heroGlassButton}>
                    <PlayCircle size={18} color={Colors.tertiary} />
                    <Text style={styles.heroButtonText}>RESUME LESSON</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>CURRICULUM PATHS</Text>
            </View>

            <View style={styles.courseList}>
              {renderCourse('Tactical Awareness', '12', 65, Target, Colors.tertiary)}
              {renderCourse('Endgame Mastery', '08', 20, Award, '#60a5fa')}
              {renderCourse('Blunder Prevention', '05', 0, Zap, '#f87171')}
              {renderCourse('Opening Repertoires', '15', 42, BookOpen, 'rgba(255,255,255,0.6)')}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>DAILY PUZZLE</Text>
            </View>

            <TouchableOpacity style={styles.glassPuzzleCard}>
              <View style={styles.puzzleLeft}>
                <Text style={styles.puzzleTitle}>Find Mate in 3</Text>
                <Text style={styles.puzzleDifficulty}>DIFFICULTY: 2200 ELO</Text>
              </View>
              <View style={styles.puzzleRight}>
                <View style={styles.solveGlassButton}>
                  <Text style={styles.solveButtonText}>SOLVE</Text>
                </View>
              </View>
            </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 60,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 2,
  },
  heroSection: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 32,
  },
  glassHeroCard: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroTextContent: {},
  heroLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.tertiary,
    letterSpacing: 2,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.onSurface,
    marginBottom: 8,
  },
  heroSubtext: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 24,
  },
  heroGlassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(234, 195, 74, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 195, 74, 0.3)',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
    width: 200,
  },
  heroButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 1,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 3,
  },
  courseList: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  glassCourseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 1,
    marginBottom: 4,
  },
  courseSub: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontWeight: '700',
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 2,
    width: '100%',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  glassPuzzleCard: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  puzzleLeft: {
    flex: 1,
  },
  puzzleTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.onSurface,
    marginBottom: 4,
  },
  puzzleDifficulty: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.tertiary,
    letterSpacing: 1,
  },
  puzzleRight: {},
  solveGlassButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(234, 195, 74, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(234, 195, 74, 0.3)',
  },
  solveButtonText: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.tertiary,
    letterSpacing: 2,
  },
});

export default AcademyScreen;
