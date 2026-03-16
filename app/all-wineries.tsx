import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Platform, ImageBackground, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Star, MapPin, ChevronRight, Search, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useWineryStore, Winery } from '../store/wineryStore';

const { width } = Dimensions.get('window');

const REGIONS = ['Toate', 'Codru', 'Ștefan Vodă', 'Valul lui Traian', 'Divin'];

function WineryListItem({ item, onPress }: { item: Winery; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer} onPress={onPress}>
      <ImageBackground
        source={{ uri: item.imageUrl }}
        style={styles.cardImage}
        imageStyle={{ borderRadius: 24 }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.85)']}
          style={styles.gradient}
        >
            <View style={styles.contentRow}>
                <View style={[styles.cardInfo, { flex: 1 }]}>
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
                    <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                </View>

                {item.logoUrl && (
                    <View style={styles.logoBadge}>
                        <Image source={{ uri: item.logoUrl }} style={styles.logoImage} />
                    </View>
                )}
            </View>
            
            <View style={styles.footerRow}>
                <TouchableOpacity 
                    style={styles.detailsButton}
                    onPress={onPress}
                >
                    <Text style={styles.detailsButtonText}>Vezi Detalii</Text>
                    <ChevronRight size={16} color="#fff" />
                </TouchableOpacity>
            </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

export default function WineriesCatalogScreen() {
  const { wineries, isLoading, fetchWineries } = useWineryStore();
  const router = useRouter();

  React.useEffect(() => {
    fetchWineries();
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Toate');

  const filteredWineries = useMemo(() => {
    return wineries.filter(w => {
        const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = selectedRegion === 'Toate' || w.region === selectedRegion || (selectedRegion === 'Divin' && w.igpId === 'divin');
        return matchesSearch && matchesRegion;
    });
  }, [wineries, searchQuery, selectedRegion]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
            <Text style={{ color: '#B81D24', fontWeight: '700' }}>Se încarcă catalogul...</Text>
        </View>
      ) : (
        <FlatList
            data={filteredWineries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <WineryListItem item={item} onPress={() => router.push({ pathname: '/winery/[id]', params: { id: item.id } })} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
                <View style={styles.listHeader}>
                    <View style={styles.searchContainer}>
                        <Search size={20} color="#999" />
                        <TextInput 
                            style={styles.searchInput}
                            placeholder="Caută o vinărie..."
                            placeholderTextColor="#999"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <X size={18} color="#999" />
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterContainer}
                    >
                        {REGIONS.map(region => (
                            <TouchableOpacity 
                                key={region}
                                style={[styles.filterChip, selectedRegion === region && styles.filterChipActive]}
                                onPress={() => setSelectedRegion(region)}
                            >
                                <Text style={[styles.filterText, selectedRegion === region && styles.filterTextActive]}>
                                    {region}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        />
      )}

      <BlurView intensity={80} tint="light" style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Toate Vinăriile</Text>
          <View style={{ width: 44 }} /> 
        </SafeAreaView>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cardContainer: {
    width: '100%',
    height: 240,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardImage: {
    flex: 1,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    borderRadius: 24,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  cardDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  cardInfo: {
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  cardName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 4,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B81D24',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    minHeight: 44,
  },
  detailsButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  listHeader: {
      paddingTop: 110,
      marginBottom: 20,
  },
  searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F5F5F5',
      marginHorizontal: 20,
      paddingHorizontal: 16,
      height: 50,
      borderRadius: 16,
      marginBottom: 16,
  },
  searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 16,
      color: '#1A1A1A',
  },
  filterContainer: {
      paddingHorizontal: 20,
      gap: 10,
  },
  filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: '#F5F5F5',
      borderWidth: 1,
      borderColor: '#EEE',
      minHeight: 44,
      justifyContent: 'center',
  },
  filterChipActive: {
      backgroundColor: '#B81D24',
      borderColor: '#B81D24',
  },
  filterText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#666',
  },
  filterTextActive: {
      color: '#FFF',
  },
});
