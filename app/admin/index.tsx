import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Calendar, MapPin } from 'lucide-react-native';

export default function AdminHub() {
    const router = useRouter();
    const sections = [
        { id: 'article', title: 'Articole', icon: BookOpen },
        { id: 'event', title: 'Evenimente', icon: Calendar },
        { id: 'winery', title: 'Vinării', icon: MapPin },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Cabinet Admin 🍷</Text>
            {sections.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    style={styles.btn}
                    onPress={() => router.push(`/admin/list?type=${item.id}`)}
                >
                    <item.icon color="#B81D24" size={24} />
                    <Text style={styles.btnText}>{item.title}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 25, paddingTop: 80, backgroundColor: '#FDFCFB' },
    header: { fontSize: 32, fontWeight: '900', color: '#4A0404', marginBottom: 40 },
    btn: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 15, elevation: 4, gap: 15 },
    btnText: { fontSize: 18, fontWeight: '700' }
});