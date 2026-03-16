import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image, TouchableOpacity, FlatList, Dimensions, Platform, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, MapPin, ChevronRight, Search, Bell, Globe, Info, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWineryStore, Winery } from '../../store/wineryStore';
import { useEventStore } from '../../store/eventStore';
import { useArticleStore } from '../../store/articleStore';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = 480;

function WineryCard({ item, onPress }: { item: Winery; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer} onPress={onPress}>
      <ImageBackground
        source={{ uri: item.imageUrl }}
        style={styles.cardImage}
        imageStyle={{ borderRadius: 32 }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={styles.gradient}
        >
          <View style={styles.cardInfo}>
            <View style={styles.topRow}>
              <View style={styles.regionBadge}>
                <MapPin size={12} color="#fff" />
                <Text style={styles.regionText}>{item.region}</Text>
              </View>
              <View style={styles.ratingRow}>
                <Star size={14} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>

            <Text style={styles.cardName}>{item.name}</Text>

            <TouchableOpacity
              style={styles.visitButton}
              onPress={onPress}
            >
              <ChevronRight size={18} color="#fff" />
              <Text style={styles.visitButtonText}>Vezi Detalii</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { wineries, isLoading: wineriesLoading, fetchWineries } = useWineryStore();
  const { fetchEvents } = useEventStore();
  const { articles } = useArticleStore();
  const router = useRouter();
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  React.useEffect(() => {
    fetchWineries();
    fetchEvents();
  }, []);

  const handleWineryPress = (item: Winery) => {
    router.push({
      pathname: '/winery/[id]',
      params: { id: item.id }
    });
  };

  const toggleSearch = () => setSearchVisible(!isSearchVisible);
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      Alert.alert('Notificări', 'Nu aveți notificări noi în acest moment.');
      setShowNotifications(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {isSearchVisible && (
        <BlurView intensity={90} tint="light" style={styles.searchOverlay}>
          <View style={styles.searchBar}>
            <Search size={20} color="#666" />
            <TextInput
              placeholder="Caută vinării, evenimente..."
              style={styles.searchInput}
              autoFocus
            />
            <TouchableOpacity onPress={toggleSearch}>
              <X size={20} color="#1A1A1A" />
            </TouchableOpacity>
          </View>
        </BlurView>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Descoperă</Text>
            {/* Вот здесь мы добавили логотип и название в один ряд */}
            <View style={styles.brandRow}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
              />
              <Text style={styles.title}>Taste of Moldova</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleSearch}>
              <Search size={22} color="#1A1A1A" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={toggleNotifications}>
              <Bell size={22} color="#1A1A1A" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vinării de Top</Text>
          <TouchableOpacity onPress={() => router.push('/all-wineries')}>
            <Text style={styles.viewAll}>Vezi toate</Text>
          </TouchableOpacity>
        </View>

        {wineriesLoading ? (
          <View style={[styles.sliderContent, { height: CARD_HEIGHT, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: '#B81D24', fontWeight: '700' }}>Se încarcă vinăriile...</Text>
          </View>
        ) : (
          <FlatList
            data={wineries}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <WineryCard item={item} onPress={() => handleWineryPress(item)} />
            )}
            contentContainerStyle={styles.sliderContent}
            snapToInterval={CARD_WIDTH + 20}
            snapToAlignment="start"
            decelerationRate="fast"
          />
        )}

        <View style={styles.igpSection}>
          <LinearGradient
            colors={['#800020', '#4A0404']}
            style={styles.igpGradient}
          >
            <View style={styles.igpHeader}>
              <Info size={24} color="#FFF" />
              <Text style={styles.igpTitle}>Sistemul IGP Moldova</Text>
            </View>
            <View style={styles.regionsGrid}>
              <View style={styles.regionChip}><Text style={styles.regionChipText}>Codru</Text></View>
              <View style={styles.regionChip}><Text style={styles.regionChipText}>Ștefan Vodă</Text></View>
              <View style={styles.regionChip}><Text style={styles.regionChipText}>Valul lui Traian</Text></View>
              <View style={styles.regionChip}><Text style={styles.regionChipText}>DIVIN</Text></View>
            </View>
            <Text style={styles.igpText}>
              Sistemul Indicațiilor Geografice Protejate (IGP) garantează calitatea și originea vinurilor noastre prin 3 regiuni distincte: **Codru**, **Ștefan Vodă** și **Valul lui Traian**.{"\n\n"}
              **IGP DIVIN**: Această categorie specială protejează prestigiul distilatelor de vin moldovenești, învechite în butoaie de stejar, recunoscute global pentru aromele de ambră și vanilie.
            </Text>
            <TouchableOpacity style={styles.igpButton} onPress={() => router.push('/(tabs)/map')}>
              <Text style={styles.igpButtonText}>Vezi pe Hartă</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ultimele Articole</Text>
        </View>

        <View style={styles.articlesList}>
          {articles.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.articleItem}
              onPress={() => router.push({ pathname: '/article/[id]', params: { id: item.id } })}
            >
              <Image source={{ uri: item.image }} style={styles.articleImage} />
              <View style={styles.articleContent}>
                <Text style={styles.articleCategory}>{item.category}</Text>
                <Text style={styles.articleTitle}>{item.title}</Text>
                <Text style={styles.articleMeta}>{item.time}</Text>
              </View>
              <ChevronRight size={20} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 180 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 25,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 35,
    height: 35,
    marginRight: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B81D24',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 100,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  viewAll: {
    color: '#B81D24',
    fontWeight: '600',
    fontSize: 14,
  },
  sliderContent: {
    paddingLeft: 24,
    paddingRight: 4,
    marginBottom: 30,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardImage: {
    flex: 1,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    borderRadius: 32,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  regionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  regionText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  cardName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: {
    color: '#FFF',
    fontWeight: '700',
    marginLeft: 4,
    fontSize: 12,
  },
  cardInfo: {
    gap: 4
  },
  visitButton: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#B81D24',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  visitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  igpSection: {
    marginHorizontal: 24,
    marginBottom: 30,
    borderRadius: 32,
    overflow: 'hidden',
  },
  igpGradient: {
    padding: 24,
  },
  igpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  igpTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
  },
  regionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  regionChip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  regionChipText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  igpText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  igpButton: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  igpButtonText: {
    color: '#800020',
    fontWeight: '700',
    fontSize: 14,
  },
  articlesList: {
    paddingHorizontal: 24,
  },
  articleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 24,
    padding: 12,
  },
  articleImage: {
    width: 70,
    height: 70,
    borderRadius: 18,
  },
  articleContent: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  articleCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B81D24',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  articleMeta: {
    fontSize: 12,
    color: '#999',
  }
});