import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Trophy, ChevronRight, Settings, Clock, Zap } from 'lucide-react-native';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const renderGameCard = (title: string, sub: string, Icon: any, color: string, mode: string) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.cardWrapper}
      onPress={() => navigation.navigate('Play', { mode })}
    >
      <View style={styles.glassCard}>
        <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
          <Icon size={24} color={color} />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{title.toUpperCase()}</Text>
          <Text style={styles.cardSub}>{sub}</Text>
        </View>
        <ChevronRight size={18} color={Colors.surfaceContainerHighest} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <View>
                <Text style={styles.welcomeText}>WELCOME BACK,</Text>
                <Text style={styles.userName}>GRANDMASTER VANCE</Text>
              </View>
              <TouchableOpacity style={styles.settingsBtn}>
                <Settings size={22} color={Colors.onSurface} />
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.glassStat}>
                <Text style={styles.statLabel}>RANKING</Text>
                <Text style={styles.statValue}>#1,242</Text>
              </View>
              <View style={styles.glassStat}>
                <Text style={styles.statLabel}>ELO RATING</Text>
                <Text style={styles.statValue}>2150</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>INITIATE DUEL</Text>
            </View>

            <View style={styles.gameModes}>
              {renderGameCard('Blitz Duel', '3 min · Competitive', Clock, Colors.tertiary, 'Blitz')}
              {renderGameCard('Rapid Arena', '10 min · Tactical', Zap, Colors.primary, 'Rapid')}
              {renderGameCard('Bullet Storm', '1 min · Instinct', Play, Colors.secondary, 'Bullet')}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>RECENT CONQUESTS</Text>
            </View>

            <View style={styles.activityFeed}>
              {[1, 2, 3].map((_, i) => (
                <View key={i} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Trophy size={16} color={Colors.tertiary} />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>Victory vs Magnus_C</Text>
                    <Text style={styles.activityTime}>2 hours ago · +18 ELO</Text>
                  </View>
                </View>
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
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    letterSpacing: 2,
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.onSurface,
    marginTop: 4,
  },
  settingsBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 32,
  },
  glassStat: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.tertiary,
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
  gameModes: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 32,
  },
  cardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  glassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: 1,
  },
  cardSub: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    fontWeight: '600',
  },
  activityFeed: {
    paddingHorizontal: 24,
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(234, 195, 74, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  activityTime: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
});

export default HomeScreen;
