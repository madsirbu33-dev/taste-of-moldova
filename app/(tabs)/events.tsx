import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar as CalendarIcon, MapPin, Building, Plus, Check, Ticket } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import * as Calendar from 'expo-calendar';
import { useEventStore, AppEvent } from '../../store/eventStore';

function EventCard({ event }: { event: AppEvent }) {
  const [isAdded, setIsAdded] = useState(false);

  const addToCalendar = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Eroare', 'Te rugăm să permiți accesul la calendar pentru a adăuga evenimente.');
      return;
    }

    try {
      let calendarId: string | null = null;
      
      if (Platform.OS === 'ios') {
        const defaultCalendar = await Calendar.getDefaultCalendarAsync();
        calendarId = defaultCalendar.id;
      } else {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const defaultCalendar = calendars.find(cal => cal.allowsModifications) || calendars[0];
        calendarId = defaultCalendar?.id;
      }

      if (!calendarId) {
        Alert.alert('Eroare', 'Nu am găsit niciun calendar editabil pe dispozitivul tău.');
        return;
      }

      const startDate = new Date(event.date);
      const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 ore implicit

      await Calendar.createEventAsync(calendarId, {
        title: event.title,
        startDate,
        endDate,
        location: event.location,
        notes: `Organizator: ${event.organizer}.\n\nDescriere: ${event.description}\n\nBilete: ${event.ticketUrl}`,
        timeZone: 'Europe/Chisinau',
      });

      setIsAdded(true);
      Alert.alert('Succes', 'Evenimentul a fost adăugat în calendarul tău!');
      
      setTimeout(() => setIsAdded(false), 3000);
    } catch (error) {
      console.error(error);
      Alert.alert('Eroare', 'Nu am putut adăuga evenimentul.');
    }
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: event.image }} style={styles.cardImage} />
      <View style={styles.priceTag}>
        <Text style={styles.priceText}>{event.price}</Text>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.organizer}>{event.organizer}</Text>
        <Text style={styles.title}>{event.title}</Text>
        
        <View style={styles.infoRow}>
          <CalendarIcon size={14} color="#666" />
          <Text style={styles.infoText}>{event.displayDate}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <MapPin size={14} color="#666" />
          <Text style={styles.infoText}>{event.location}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.calendarButton, isAdded && styles.calendarButtonActive]} 
            onPress={addToCalendar}
            disabled={isAdded}
          >
            {isAdded ? (
              <>
                <Check size={18} color="#FFF" />
                <Text style={styles.buttonText}>Adăugat</Text>
              </>
            ) : (
              <>
                <Plus size={18} color="#B81D24" />
                <Text style={[styles.buttonText, { color: '#B81D24' }]}>Calendar</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.ticketButton}
            onPress={() => Linking.openURL(event.ticketUrl)}
          >
            <Ticket size={18} color="#FFF" />
            <Text style={styles.ticketButtonText}>Bilete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function EventsScreen() {
  const { events, isLoading, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Calendar 2026</Text>
        <Text style={styles.headerTitle}>Evenimente</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
                <Text style={{ color: '#B81D24', fontWeight: '700' }}>Se încarcă evenimentele...</Text>
            </View>
        ) : events.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
                <Text style={{ color: '#666' }}>Momentan nu sunt evenimente programate.</Text>
            </View>
        ) : (
            <>
                {events.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
            </>
        )}
        <View style={{ height: 180 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B81D24',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  priceTag: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#B81D24',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  priceText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  cardContent: {
    padding: 20,
  },
  organizer: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B81D24',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  calendarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#B81D24',
    borderRadius: 16,
    paddingVertical: 12,
  },
  ticketButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B81D24',
    borderRadius: 16,
    paddingVertical: 12,
  },
  ticketButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 8,
  },
  calendarButtonActive: {
    backgroundColor: '#28A745',
    borderColor: '#28A745',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  }
});
