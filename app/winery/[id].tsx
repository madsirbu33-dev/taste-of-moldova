import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { API_CONFIG } from '../../constants/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Star, Globe, Calendar, ChevronLeft, Info, Trophy, Phone, Mail } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useWineryStore } from '../../store/wineryStore';
import * as Linking from 'expo-linking';
import Toast from '../../components/Toast';

const { width } = Dimensions.get('window');

export default function WineryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { wineries } = useWineryStore();
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  
  const winery = wineries.find(w => w.id === id);

  const showToast = (msg: string) => {
      setToastMessage(msg);
      setToastVisible(true);
  };

  useEffect(() => {
    if (winery) {
      fetch(`${API_CONFIG.BASE_URL}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'winery_view', id: winery.id })
      }).catch(err => console.error('Tracking Error:', err));
    }
  }, [id]);

  if (!winery) {
    return (
      <View style={styles.errorContainer}>
        <Text>Vinăria nu a fost găsită.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#B81D24', marginTop: 10 }}>Înapoi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        bounces={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero Image */}
        <ImageBackground source={{ uri: winery.imageUrl }} style={styles.heroImage}>
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.1)', 'transparent']}
            style={styles.heroGradient}
          >
            <SafeAreaView edges={['top']} style={styles.headerRow}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ChevronLeft size={24} color="#FFF" />
              </TouchableOpacity>
              <View style={{ width: 44 }} />
            </SafeAreaView>
          </LinearGradient>
        </ImageBackground>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.name}>{winery.name}</Text>
              <View style={styles.ratingRow}>
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingText}>{winery.rating}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Despre Vinărie</Text>
            <Text style={styles.description}>{winery.longDescription || winery.description}</Text>
          </View>

          <View style={styles.terroirCard}>
            <LinearGradient
                colors={['#FDFCFB', '#E2D1C3']}
                style={styles.terroirGradient}
            >
                <View style={styles.sectionHeader}>
                    <Info size={18} color="#B81D24" />
                    <Text style={styles.terroirTitle}>Terroir & Caracter</Text>
                </View>
                <Text style={styles.terroirContent}>{winery.terroir}</Text>
            </LinearGradient>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Trophy size={18} color="#B81D24" />
                <Text style={styles.sectionTitle}>Vinuri de Top</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wineScroll}>
                {winery.topWines.map((wine, index) => (
                    <View key={index} style={styles.wineBadge}>
                        <Text style={styles.wineName}>{wine}</Text>
                    </View>
                ))}
            </ScrollView>
          </View>

          {winery.amenities && winery.amenities.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Facilități</Text>
              </View>
              <View style={styles.amenitiesGrid}>
                  {winery.amenities.map((amenity, index) => (
                      <View key={index} style={styles.amenityBadge}>
                          <Text style={styles.amenityText}>{amenity}</Text>
                      </View>
                  ))}
              </View>
            </View>
          )}

          {winery.contactInfo && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact & Reservări</Text>
              <View style={styles.contactContainer}>
                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => {
                      showToast('Apelare...');
                      setTimeout(() => Linking.openURL(`tel:${winery.contactInfo?.phone}`), 500);
                  }}
                >
                  <View style={styles.contactIcon}>
                    <Phone size={18} color="#B81D24" />
                  </View>
                  <Text style={styles.contactLabel}>Telefon</Text>
                  <Text style={styles.contactValue}>{winery.contactInfo.phone}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => {
                      showToast('Se deschide clientul de email...');
                      setTimeout(() => Linking.openURL(`mailto:${winery.contactInfo?.email}`), 500);
                  }}
                >
                  <View style={styles.contactIcon}>
                    <Mail size={18} color="#B81D24" />
                  </View>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>{winery.contactInfo.email}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{ height: 180 }} />
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <BlurView intensity={90} tint="light" style={styles.bottomActions}>
          <TouchableOpacity 
            style={styles.secondaryAction}
            onPress={() => {
                showToast('Deschidere Website...');
                setTimeout(() => Linking.openURL(winery.websiteUrl), 500);
            }}
          >
            <Globe size={20} color="#B81D24" />
            <Text style={styles.secondaryText}>Website</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.primaryAction}
            onPress={() => {
                showToast('Redirecționare spre rezervare...');
                setTimeout(() => Linking.openURL(winery.bookingUrl), 500);
            }}
          >
            <Calendar size={20} color="#FFF" />
            <Text style={styles.primaryText}>Rezervă Acum</Text>
          </TouchableOpacity>
      </BlurView>
      <Toast message={toastMessage} visible={toastVisible} onHide={() => setToastVisible(false)} type="info" />
    </View>
  );
}

// Helper to support ImageBackground since it's common
const ImageBackground = ({ children, source, style }: any) => (
    <View style={style}>
        <Image source={source} style={StyleSheet.absoluteFill} />
        {children}
    </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  heroImage: {
    width: width,
    height: 400,
  },
  heroGradient: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'android' ? 20 : 0,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeLabel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  badgeText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  content: {
    marginTop: -40,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
  },
  titleRow: {
    marginBottom: 24,
  },
  name: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 6,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  terroirCard: {
      marginBottom: 28,
      borderRadius: 24,
      overflow: 'hidden',
  },
  terroirGradient: {
      padding: 20,
  },
  terroirTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#B81D24',
  },
  terroirContent: {
      fontSize: 15,
      lineHeight: 22,
      color: '#555',
  },
  wineScroll: {
      gap: 12,
      paddingRight: 20,
  },
  wineBadge: {
      backgroundColor: '#F7F7F7',
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: '#EEE',
      minWidth: 140,
      minHeight: 44,
      alignItems: 'center',
  },
  wineName: {
      fontSize: 14,
      fontWeight: '700',
      color: '#1A1A1A',
  },
  amenitiesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
  },
  amenityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#EEE',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      minHeight: 44,
  },
  amenityText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#444',
  },
  contactContainer: {
    marginTop: 15,
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    minHeight: 44,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(184, 29, 36, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    width: 60,
  },
  contactValue: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '700',
    textAlign: 'right',
  },
  bottomActions: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 24,
      paddingBottom: Platform.OS === 'ios' ? 40 : 24,
      flexDirection: 'row',
      gap: 15,
      borderTopWidth: 1,
      borderTopColor: 'rgba(0,0,0,0.05)',
  },
  secondaryAction: {
      flex: 1,
      height: 56,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: '#B81D24',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
  },
  secondaryText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#B81D24',
  },
  primaryAction: {
      flex: 2,
      height: 56,
      backgroundColor: '#B81D24',
      borderRadius: 18,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      shadowColor: '#B81D24',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
  },
  primaryText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFF',
  },
  errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  }
});
