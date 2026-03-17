import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function AdminList() {
    const { type } = useLocalSearchParams();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const endpoint = type === 'winery' ? 'wineries' : type === 'event' ? 'events' : 'articles';
        fetch(`https://taste-of-moldova.onrender.com/api/${endpoint}`)
            .then(res => res.json())
            .then(data => { setItems(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#B81D24" />;

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => router.push({
                            pathname: '/admin/edit-item',
                            params: { id: item.id, type, oldTitle: item.name || item.title, oldDesc: item.description || item.content, oldImg: item.image }
                        })}
                    >
                        <Text style={styles.cardText}>{item.name || item.title}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 20 },
    card: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    cardText: { fontSize: 16, fontWeight: '600' }
});