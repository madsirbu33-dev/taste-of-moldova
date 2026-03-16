import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CheckCircle, Info } from 'lucide-react-native';

interface ToastProps {
    message: string;
    type?: 'success' | 'info';
    visible: boolean;
    onHide: () => void;
}

export default function Toast({ message, type = 'success', visible, onHide }: ToastProps) {
    const [opacity] = useState(new Animated.Value(0));
    const [translateY] = useState(new Animated.Value(-20));

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true })
            ]).start(() => {
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
                        Animated.timing(translateY, { toValue: -20, duration: 300, useNativeDriver: true })
                    ]).start(() => {
                        onHide();
                    });
                }, 2500);
            });
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
            {type === 'success' ? (
                <CheckCircle size={20} color="#4ade80" />
            ) : (
                <Info size={20} color="#60a5fa" />
            )}
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
        zIndex: 1000,
    },
    message: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
    }
});
