import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomMapView from '../../components/MapView.native';
import { useWineryStore } from '../../store/wineryStore';
import { Map as MapIcon, Layers, Info, Clock, Navigation, Grape, X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

export default function MapScreen() {
  const { wineries } = useWineryStore();
  const [showRoutes, setShowRoutes] = useState(false);
  const [showZones, setShowZones] = useState(true);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  // Define wine routes
  const wineRoutes = useMemo(() => {
    const findCoords = (name: string) => {
        const w = wineries.find(winery => winery.name === name);
        return w ? w.coordinates : { latitude: 0, longitude: 0 };
    };

    return [
      {
        id: 'iter-vitis',
        name: 'Ruta Iter Vitis',
        duration: '2 zile',
        distance: '120 km',
        wineries: ['Cricova Winery', 'Castel Mimi', 'Asconi Winery'],
        color: '#20B2AA',
        coordinates: [
          findCoords('Cricova Winery'),
          findCoords('Castel Mimi'),
          findCoords('Asconi Winery'),
        ]
      },
      {
        id: 'stefan-voda',
        name: 'Ruta Ștefan Vodă',
        duration: '1 zi',
        distance: '45 km',
        wineries: ['Château Purcari', 'Et Cetera'],
        color: '#48D1CC',
        coordinates: [
          findCoords('Château Purcari'),
          findCoords('Et Cetera'),
        ]
      }
    ];
  }, [wineries]);

  const selectedRoute = useMemo(() => 
    wineRoutes.find(r => r.id === selectedRouteId),
  [wineRoutes, selectedRouteId]);

  // Define IGP Zones
  const igpZones = useMemo(() => [
    {
      id: 'codru',
      name: 'IGP Codru',
      color: '#800020',
      coordinates: [
        { latitude: 47.4, longitude: 28.5 },
        { latitude: 47.4, longitude: 29.2 },
        { latitude: 46.8, longitude: 29.3 },
        { latitude: 46.7, longitude: 28.3 },
        { latitude: 47.1, longitude: 28.1 },
      ]
    },
    {
      id: 'stefan-voda-zone',
      name: 'IGP Ștefan Vodă',
      color: '#FF6347',
      coordinates: [
        { latitude: 46.6, longitude: 29.5 },
        { latitude: 46.7, longitude: 30.0 },
        { latitude: 46.4, longitude: 30.1 },
        { latitude: 46.3, longitude: 29.7 },
      ]
    },
    {
      id: 'valul-lui-traian',
      name: 'IGP Valul lui Traian',
      color: '#FFD700',
      center: { latitude: 45.9, longitude: 28.2 },
      radius: 40000, // 40km circle as proxy
    },
    {
        id: 'divin',
        name: 'IGP DIVIN',
        color: '#CD7F32',
        center: { latitude: 47.0, longitude: 28.8 },
        radius: 15000, // Central circle for spirits
    }
  ], []);

  return (
    <View style={styles.container}>
      <CustomMapView 
        markers={wineries} 
        routes={showRoutes ? wineRoutes : []}
        zones={showZones ? igpZones : []}
        onRoutePress={(id: string) => {
            setSelectedRouteId(id);
            setShowRoutes(true);
        }}
      />
      
      <SafeAreaView style={styles.mapOverlay} edges={['top']}>
         <View style={styles.overlayHeader}>
            <View style={styles.titleContainer}>
                <MapIcon size={20} color="#B81D24" />
                <Text style={styles.overlayTitle}>Explorează Moldova</Text>
            </View>
            <View style={styles.controls}>
                <TouchableOpacity 
                    style={[styles.toggleButton, showZones && styles.toggleButtonActive]}
                    onPress={() => setShowZones(!showZones)}
                >
                    <Info size={16} color={showZones ? '#fff' : '#1A1A1A'} />
                    <Text style={[styles.toggleText, showZones && styles.toggleTextActive]}>Zonă IGP</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.toggleButton, showRoutes && styles.toggleButtonActive]}
                    onPress={() => setShowRoutes(!showRoutes)}
                >
                    <Layers size={16} color={showRoutes ? '#fff' : '#1A1A1A'} />
                    <Text style={[styles.toggleText, showRoutes && styles.toggleTextActive]}>Rute</Text>
                </TouchableOpacity>
            </View>
         </View>

         {/* IGP Divin Global Info */}
          <BlurView intensity={90} tint="light" style={styles.divinCard}>
            <View style={styles.divinHeader}>
                <Text style={styles.divinTitle}>IGP DIVIN</Text>
                <View style={styles.divinBadge}>
                    <Text style={styles.divinBadgeText}>Național</Text>
                </View>
            </View>
            <Text style={styles.divinText}>Indicație geografică pentru distilate de vin învechite pe tot teritoriul Moldovei.</Text>
          </BlurView>
        </SafeAreaView>

        {/* Route Detail Card */}
        {selectedRoute && (
            <BlurView intensity={100} tint="light" style={styles.routeCard}>
                <View style={styles.routeHeader}>
                    <View>
                        <Text style={styles.routeName}>{selectedRoute.name}</Text>
                        <View style={styles.routeMeta}>
                            <View style={styles.metaItem}>
                                <Clock size={14} color="#666" />
                                <Text style={styles.metaText}>{selectedRoute.duration}</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Navigation size={14} color="#666" />
                                <Text style={styles.metaText}>{selectedRoute.distance}</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.closeButton}
                        onPress={() => setSelectedRouteId(null)}
                    >
                        <X size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                <View style={styles.wineryList}>
                    {selectedRoute.wineries.map((w, idx) => (
                        <View key={idx} style={styles.wineryItem}>
                            <View style={styles.wineryDot} />
                            <Text style={styles.wineryName}>{w}</Text>
                        </View>
                    ))}
                </View>
                
                <TouchableOpacity style={styles.routeAction}>
                    <Text style={styles.routeActionText}>Începe Navigarea</Text>
                </TouchableOpacity>
            </BlurView>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    top: 20,
    left: 15,
    right: 15,
  },
  overlayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  overlayTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  controls: {
      flexDirection: 'row',
      gap: 6,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  toggleButtonActive: {
    backgroundColor: '#B81D24',
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  toggleTextActive: {
    color: '#fff',
  },
  divinCard: {
      backgroundColor: 'rgba(255,255,255,0.9)',
      padding: 15,
      borderRadius: 20,
      width: '60%',
      alignSelf: 'flex-start',
      borderLeftWidth: 4,
      borderLeftColor: '#CD7F32',
  },
  divinHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
  },
  divinTitle: {
      fontSize: 14,
      fontWeight: '900',
      color: '#CD7F32',
  },
  divinBadge: {
      backgroundColor: '#CD7F32',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
  },
  divinBadgeText: {
      color: '#FFF',
      fontSize: 9,
      fontWeight: '800',
  },
  divinText: {
      fontSize: 11,
      color: '#444',
      lineHeight: 15,
  },
  routeCard: {
      position: 'absolute',
      bottom: 120,
      left: 15,
      right: 15,
      padding: 24,
      borderRadius: 32,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
  },
  routeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
  },
  routeName: {
      fontSize: 20,
      fontWeight: '800',
      color: '#1A1A1A',
      marginBottom: 4,
  },
  routeMeta: {
      flexDirection: 'row',
      gap: 16,
  },
  metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
  },
  metaText: {
      fontSize: 12,
      color: '#666',
      fontWeight: '600',
  },
  closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#F0F0F0',
      justifyContent: 'center',
      alignItems: 'center',
  },
  wineryList: {
      gap: 8,
      marginBottom: 20,
  },
  wineryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
  },
  wineryDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#B81D24',
  },
  wineryName: {
      fontSize: 14,
      color: '#444',
      fontWeight: '500',
  },
  routeAction: {
      backgroundColor: '#B81D24',
      height: 50,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
  },
  routeActionText: {
      color: '#FFF',
      fontSize: 14,
      fontWeight: '700',
  }
});
