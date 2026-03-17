import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Save, Camera, ArrowLeft } from 'lucide-react-native';

export default function EditItem() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const [title, setTitle] = useState(params.oldTitle || '');
    const [desc, setDesc] = useState(params.oldDesc || '');
    const [image, setImage] = useState(params.oldImg || null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.3,
            base64: true
        });

        if (!result.canceled) {
            setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://taste-of-moldova.onrender.com/api/${params.type}/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: "Moldova2026",
                    title: title,
                    name: title,
                    description: desc,
                    content: desc,
                    image: image
                })
            });

            if (response.ok) {
                Alert.alert("Succes", "Informația a fost salvată pe Render!");
                router.dismissAll();
                router.replace('/admin');
            } else {
                Alert.alert("Eроаре", "Nu s-a putut salva.");
            }
        } catch (error) {
            Alert.alert("Eроаре", "Eroare de conexiune");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={{ marginTop: 40 }} onPress={() => router.back()}>
                <ArrowLeft color="#000" size={28} />
            </TouchableOpacity>
            <Text style={styles.header}>Editare {params.type}</Text>

            <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
                {image ? <Image source={{ uri: image }} style={styles.img} /> : <View style={styles.placeholder}><Camera color="#999" size={30} /></View>}
            </TouchableOpacity>

            <Text style={styles.label}>Titlu / Nume</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />

            <Text style={styles.label}>Conținut / Descriere</Text>
            <TextInput style={[styles.input, styles.textArea]} value={desc} onChangeText={setDesc} multiline />

            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <><Save color="#FFF" size={20} /><Text style={styles.saveBtnText}>Actualizează pe Render</Text></>}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF', padding: 20 },
    header: { fontSize: 26, fontWeight: '900', color: '#4A0404', marginVertical: 20 },
    imageBox: { width: '100%', height: 200, backgroundColor: '#F5F5F5', borderRadius: 20, overflow: 'hidden', marginBottom: 20 },
    img: { width: '100%', height: '100%' },
    placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    label: { fontSize: 14, fontWeight: '700', color: '#666', marginBottom: 8 },
    input: { backgroundColor: '#F9F9F9', padding: 18, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: '#EEE' },
    textArea: { height: 150, textAlignVertical: 'top' },
    saveBtn: { backgroundColor: '#B81D24', height: 65, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 50 },
    saveBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' }
});