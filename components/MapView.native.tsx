import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, Callout, Polyline, Polygon, Circle } from 'react-native-maps';
import { Winery } from '../store/wineryStore';
import { useRouter } from 'expo-router';

interface MapViewProps {
  markers: Winery[];
  routes?: Array<{
    id: string;
    coordinates: Array<{ latitude: number; longitude: number }>;
    color: string;
    name: string;
  }>;
  zones?: Array<{
    id: string;
    name: string;
    coordinates?: Array<{ latitude: number; longitude: number }>;
    center?: { latitude: number; longitude: number };
    radius?: number;
    color: string;
  }>;
  onRoutePress?: (routeId: string) => void;
}

export default function CustomMapView({ markers, routes, zones, onRoutePress }: MapViewProps) {
  const router = useRouter();

  const handleViewDetails = (id: string) => {
    router.push({
        pathname: '/winery/[id]',
        params: { id }
    });
  };

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 47.0105,
        longitude: 28.8638,
        latitudeDelta: 1.5,
        longitudeDelta: 1.5,
      }}
    >
      {/* Render IGP Zones */}
      {zones?.map((zone) => (
          zone.coordinates ? (
            <Polygon
              key={zone.id}
              coordinates={zone.coordinates}
              fillColor={`${zone.color}22`} // Semi-transparent
              strokeColor={zone.color}
              strokeWidth={2}
            />
          ) : (
            <Circle 
              key={zone.id}
              center={zone.center!}
              radius={zone.radius!}
              fillColor={`${zone.color}11`}
              strokeColor={zone.color}
              strokeWidth={1.5}
            />
          )
      ))}

      {/* Render Wine Routes */}
      {routes?.map((route) => (
        <Polyline
          key={route.id}
          coordinates={route.coordinates}
          strokeColor={route.color}
          strokeWidth={6}
          lineDashPattern={[10, 5]}
          tappable={true}
          onPress={() => onRoutePress?.(route.id)}
        />
      ))}

      {/* Render Winery Markers */}
      {markers.map((winery) => (
        <Marker 
          key={winery.id}
          coordinate={winery.coordinates}
          pinColor="#B81D24"
        >
          <Callout onPress={() => handleViewDetails(winery.id)}>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutTitle}>{winery.name}</Text>
              <Text style={styles.calloutRegion}>{winery.region}</Text>
              <View style={styles.calloutButton}>
                <Text style={styles.calloutButtonText}>Vezi Detalii</Text>
              </View>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  calloutContainer: {
    padding: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  calloutRegion: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  calloutButton: {
    backgroundColor: '#B81D24',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  calloutButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  }
});
