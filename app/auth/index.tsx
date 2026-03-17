import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <LinearGradient colors={['#FDFCFB', '#E2D1C3']} style={StyleSheet.absoluteFill} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>Taste of Moldova</Text>
                    <Text style={styles.subtitle}>
                        {isLogin ? 'Autentifică-te для доступа к винам' : 'Creează un cont новый аккаунт'}
                    </Text>

                    <View style={styles.form}>
                        {!isLogin && (
                            <TextInput placeholder="Nume Complet" style={styles.input} placeholderTextColor="#999" />
                        )}
                        <TextInput
                            placeholder="Email"
                            style={styles.input}
                            autoCapitalize="none"
                            placeholderTextColor="#999"
                        />
                        <TextInput
                            placeholder="Parolă"
                            style={styles.input}
                            secureTextEntry
                            placeholderTextColor="#999"
                        />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => router.replace('/(tabs)')}
                        >
                            <LinearGradient colors={['#B81D24', '#800020']} style={styles.gradient}>
                                <Text style={styles.buttonText}>
                                    {isLogin ? 'Autentificare' : 'Înregistrare'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.footer} onPress={() => setIsLogin(!isLogin)}>
                        <Text style={styles.footerText}>
                            {isLogin ? 'Nu ai un cont? ' : 'Ai deja un cont? '}
                            <Text style={styles.footerLink}>
                                {isLogin ? 'Înregistrează-te' : 'Loghează-te'}
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboardView: { flex: 1, justifyContent: 'center' },
    content: { padding: 30, alignItems: 'center' },
    logo: { width: 100, height: 100, marginBottom: 15, resizeMode: 'contain' },
    title: { fontSize: 28, fontWeight: '900', color: '#4A0404', marginBottom: 5 },
    subtitle: { fontSize: 15, color: '#666', marginBottom: 35, textAlign: 'center' },
    form: { width: '100%', gap: 15 },
    input: { backgroundColor: '#FFF', padding: 18, borderRadius: 15, fontSize: 16, borderWidth: 1, borderColor: '#EEE' },
    button: { height: 60, borderRadius: 15, overflow: 'hidden', marginTop: 10, elevation: 3 },
    gradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
    footer: { marginTop: 25 },
    footerText: { color: '#666', fontSize: 15 },
    footerLink: { color: '#B81D24', fontWeight: '800' }
});