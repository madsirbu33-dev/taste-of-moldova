import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Winery } from '../store/wineryStore';
import * as Linking from 'expo-linking';
import { MapPin, Globe, Calendar as CalendarIcon, X } from 'lucide-react-native';

interface MapViewProps {
  markers: Winery[];
  routes?: Array<{
    id: string;
    coordinates: Array<{ latitude: number; longitude: number }>;
    color: string;
    name: string;
  }>;
}

export default function CustomMapView({ markers, routes }: MapViewProps) {
  const [selectedWinery, setSelectedWinery] = useState<Winery | null>(null);

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.webMap}>
        <View style={styles.overlay}>
          <Text style={styles.webTitle}>Hartă Interactivă (Web)</Text>
          <Text style={styles.webSubtitle}>Selectează o vinărie pentru detalii</Text>
        </View>

        <ScrollView contentContainerStyle={styles.markerList}>
          {markers.map((winery) => {
            return (
              <TouchableOpacity
                key={winery.id}
                style={styles.markerItem}
                onPress={() => setSelectedWinery(winery)}
              >
                <View style={styles.markerIcon}>
                  <MapPin size={20} color="#B81D24" />
                </View>
                <View>
                  <Text style={styles.markerName}>{winery.name}</Text>
                  <Text style={styles.markerRegion}>{winery.region}</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {routes && routes.length > 0 && (
            <View style={styles.routesSection}>
              <Text style={styles.routesTitle}>Rute active:</Text>
              {routes.map((route) => {
                return (
                  <View key={route.id} style={styles.routeBadge}>
                     <View style={[styles.routeLine, { backgroundColor: route.color }]} />
                     <Text style={styles.routeName}>{route.name}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>

      {selectedWinery && (
        <View style={styles.detailPopup}>
          <View style={styles.popupHeader}>
             <Text style={styles.popupTitle}>{selectedWinery.name}</Text>
             <TouchableOpacity onPress={() => setSelectedWinery(null)}>
                <X size={24} color="#666" />
             </TouchableOpacity>
          </View>
          <Text style={styles.popupRegion}>{selectedWinery.region}</Text>
          <Text style={styles.popupDesc} numberOfLines={3}>{selectedWinery.description}</Text>
          
          <View style={styles.popupButtons}>
            <TouchableOpacity 
                style={[styles.popupButton, styles.primaryButton]}
                onPress={() => handleOpenLink(selectedWinery.websiteUrl)}
            >
              <Globe size={16} color="#fff" />
              <Text style={styles.buttonText}>Site Web</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.popupButton, styles.secondaryButton]}
                onPress={() => handleOpenLink(selectedWinery.bookingUrl)}
            >
              <CalendarIcon size={16} color="#B81D24" />
              <Text style={[styles.buttonText, { color: '#B81D24' }]}>Rezervă</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  webMap: {
    flex: 1,
    padding: 24,
  },
  overlay: {
    marginBottom: 24,
  },
  webTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  webSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  markerList: {
    gap: 12,
    paddingBottom: 100,
  },
  markerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  markerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(184, 29, 36, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  markerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  markerRegion: {
    fontSize: 14,
    color: '#666',
  },
  routesSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  routesTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#999',
    marginBottom: 12,
  },
  routeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeLine: {
    width: 24,
    height: 4,
    borderRadius: 2,
    marginRight: 10,
  },
  routeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  detailPopup: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  popupTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  popupRegion: {
    fontSize: 14,
    color: '#B81D24',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  popupDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 20,
  },
  popupButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  popupButton: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#B81D24',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#B81D24',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  }
});
