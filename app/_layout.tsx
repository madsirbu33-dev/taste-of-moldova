import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';

// Удерживаем заставку, пока всё не прогрузится
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [appReady, setAppReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Искусственная пауза 2 секунды для красоты и подгрузки данных
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                setAppReady(true);
                await SplashScreen.hideAsync();
            }
        }
        prepare();
    }, []);

    if (!appReady) return null;

    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Экран регистрации и входа */}
            <Stack.Screen name="auth/index" options={{ headerShown: false }} />

            {/* Главное приложение (табы) */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            {/* --- СЕКЦИЯ АДМИНА --- */}

            {/* Главная панель админа */}
            <Stack.Screen
                name="admin/index"
                options={{
                    headerShown: false,
                    presentation: 'card'
                }}
            />

            {/* Список элементов для выбора (статьи или ивенты) */}
            <Stack.Screen
                name="admin/list"
                options={{
                    headerShown: true,
                    title: 'Selectează element',
                    headerTintColor: '#B81D24',
                    headerBackTitle: 'Înapoi'
                }}
            />

            {/* Сам редактор текста и фото */}
            <Stack.Screen
                name="admin/edit-item"
                options={{
                    headerShown: true,
                    title: 'Editare conținut',
                    headerTintColor: '#B81D24',
                    headerBackTitle: 'Anulează'
                }}
            />
        </Stack>
    );
}