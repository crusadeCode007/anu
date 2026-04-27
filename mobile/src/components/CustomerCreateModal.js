import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../api/apiClient';

export default function CustomerCreateModal({ visible, onClose, onCreate }) {
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setCompanyName('');
        setEmail('');
        setPhone('');
        setImageUri(null);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const isValidEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const handleSave = async () => {
        if (!companyName.trim() || !email.trim() || !phone.trim()) {
            Alert.alert('Error', 'Fields cannot be empty');
            return;
        }

        if (!isValidEmail(email.trim())) {
            Alert.alert('Validation Error', 'Enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('companyName', companyName);
            formData.append('email', email);
            formData.append('phone', phone);
            
            if (imageUri) {
                formData.append('image', {
                    uri: imageUri,
                    name: `photo_${Date.now()}.jpg`,
                    type: 'image/jpeg'
                });
            }

            const response = await apiClient.post('/customers', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onCreate(response.data);
            resetForm();
            onClose();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to create');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>Create Customer</Text>

                    <View style={styles.imageSection}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.avatarPreview} />
                        ) : (
                            <View style={styles.avatarPlaceholder}><Text style={{color:'#fff'}}>+</Text></View>
                        )}
                        <TouchableOpacity style={styles.imgBtn} onPress={pickImage}>
                            <Text style={styles.imgBtnText}>{imageUri ? 'Change Image' : 'Add Image (Optional)'}</Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput style={styles.input} placeholderTextColor="#666" placeholder="Company Name" value={companyName} onChangeText={setCompanyName} />
                    <TextInput style={styles.input} placeholderTextColor="#666" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    <TextInput style={styles.input} placeholderTextColor="#666" placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

                    <View style={styles.actionSection}>
                        <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={handleClose} disabled={loading}>
                            <Text style={styles.btnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={handleSave} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
    card: { backgroundColor: '#1E1E24', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 25 },
    title: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    imageSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    avatarPreview: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
    avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, marginRight: 15, backgroundColor: '#3a3a4a', justifyContent: 'center', alignItems: 'center' },
    imgBtn: { backgroundColor: '#3a3a4a', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8 },
    imgBtnText: { color: '#fff', fontSize: 14 },
    input: { backgroundColor: '#2A2A35', color: '#fff', borderRadius: 8, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#3a3a4a' },
    actionSection: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingBottom: 20 },
    btn: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
    cancelBtn: { backgroundColor: '#ef4444' },
    saveBtn: { backgroundColor: '#7C4DFF' },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
