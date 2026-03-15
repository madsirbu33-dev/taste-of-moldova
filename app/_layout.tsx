import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { View, StyleSheet, Text, Image, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({});
  const [appReady, setAppReady] = (useState(false));
  const [splashVisible, setSplashVisible] = (useState(true));
  const fadeAnim = (new Animated.Value(1));

  useEffect(() => {
    if (loaded || error) {
      // Keep splash for 3 seconds to show branding
      setTimeout(() => {
          setAppReady(true);
          Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
          }).start(() => {
              setSplashVisible(false);
              SplashScreen.hideAsync();
          });
      }, 3000);

      // Mock Push Notification after 5 seconds
      setTimeout(() => {
          Alert.alert(
              "Taste of Moldova 🍷",
              "Salut, Madalina! Ești în regiunea Codru. Vizitează Castel Mimi pentru o degustare premium!",
              [{ text: "Vezi Detalii", onPress: () => {} }, { text: "Mai târziu", style: 'cancel' }]
          );
      }, 8000); // 3s splash + 5s in-app
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      {appReady && (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen 
                name="winery/[id]" 
                options={{ 
                    headerShown: false,
                    presentation: 'modal',
                    animation: 'slide_from_bottom'
                }} 
            />
            <Stack.Screen 
                name="article/[id]" 
                options={{ 
                    headerShown: false,
                    presentation: 'modal',
                    animation: 'slide_from_left'
                }} 
            />
            <Stack.Screen 
                name="all-wineries" 
                options={{ 
                    headerShown: false,
                    animation: 'fade'
                }} 
            />
          </Stack>
      )}

      {splashVisible && (
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim, zIndex: 1000 }]}>
              <LinearGradient
                  colors={['#800020', '#4A0404']}
                  style={styles.splashContainer}
              >
                  <View style={styles.logoCircle}>
                      <Image 
                        source={{ uri: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop' }} 
                        style={styles.splashLogo} 
                      />
                  </View>
                  <Text style={styles.splashTitle}>Taste of Moldova</Text>
                  <Text style={styles.splashSubtitle}>Wine Heritage & Culture</Text>
                  <View style={styles.ornamentContainer}>
                      <Text style={styles.ornament}>✼</Text>
                      <View style={styles.ornamentLine} />
                      <Text style={styles.ornament}>✼</Text>
                  </View>
              </LinearGradient>
          </Animated.View>
      )}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  splashContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  logoCircle: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 30,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
  },
  splashLogo: {
      width: 100,
      height: 100,
      borderRadius: 50,
  },
  splashTitle: {
      fontSize: 32,
      fontWeight: '900',
      color: '#FFF',
      letterSpacing: 2,
  },
  splashSubtitle: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.7)',
      marginTop: 8,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 4,
  },
  ornamentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 40,
      gap: 15,
  },
  ornament: {
      color: 'rgba(255,255,255,0.3)',
      fontSize: 20,
  },
  ornamentLine: {
      width: 60,
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
