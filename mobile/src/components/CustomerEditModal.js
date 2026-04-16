import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import apiClient, { getImageUrl } from '../api/apiClient';

export default function CustomerEditModal({ visible, customer, onClose, onUpdate }) {
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (customer) {
            setCompanyName(customer.companyName || '');
            setEmail(customer.email || '');
            setPhone(customer.phone || '');
            setImageUri(null);
            setRemoveImage(false);
        }
    }, [customer]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setRemoveImage(false);
        }
    };

    const handleSave = async () => {
        if (!companyName.trim() || !email.trim() || !phone.trim()) {
            Alert.alert('Error', 'Fields cannot be empty');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('companyName', companyName);
            formData.append('email', email);
            formData.append('phone', phone);
            
            if (removeImage) {
                formData.append('removeImage', 'true');
            } else if (imageUri) {
                formData.append('image', {
                    uri: imageUri,
                    name: `photo_${Date.now()}.jpg`,
                    type: 'image/jpeg'
                });
            }

            const response = await apiClient.put(`/customers/${customer._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onUpdate(response.data);
            onClose();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to update');
        } finally {
            setLoading(false);
        }
    };

    if (!customer) return null;
    
    // Determine which avatar to show in preview
    const displayUri = imageUri || (!removeImage ? getImageUrl(customer.profileImageUrl) : null);

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>Edit Customer</Text>

                    <View style={styles.imageSection}>
                        {displayUri ? (
                            <Image source={{ uri: displayUri }} style={styles.avatarPreview} />
                        ) : (
                            <View style={styles.avatarPlaceholder}><Text style={{color:'#fff'}}>+</Text></View>
                        )}
                        <View style={styles.imageButtons}>
                            <TouchableOpacity style={styles.imgBtn} onPress={pickImage}>
                                <Text style={styles.imgBtnText}>Change Image</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.imgBtn, { backgroundColor: '#ef4444' }]} onPress={() => { setImageUri(null); setRemoveImage(true); }}>
                                <Text style={styles.imgBtnText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TextInput style={styles.input} placeholderTextColor="#666" placeholder="Company Name" value={companyName} onChangeText={setCompanyName} />
                    <TextInput style={styles.input} placeholderTextColor="#666" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    <TextInput style={styles.input} placeholderTextColor="#666" placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

                    <View style={styles.actionSection}>
                        <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onClose} disabled={loading}>
                            <Text style={styles.btnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={handleSave} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Save</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
    card: { backgroundColor: '#1E1E24', borderRadius: 15, padding: 20 },
    title: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    imageSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    avatarPreview: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
    avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, marginRight: 15, backgroundColor: '#3a3a4a', justifyContent: 'center', alignItems: 'center' },
    imageButtons: { flex: 1, flexDirection: 'row', gap: 10 },
    imgBtn: { backgroundColor: '#3b82f6', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 6 },
    imgBtnText: { color: '#fff', fontSize: 12 },
    input: { backgroundColor: '#2A2A35', color: '#fff', borderRadius: 8, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#3a3a4a' },
    actionSection: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    btn: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
    cancelBtn: { backgroundColor: '#3a3a4a' },
    saveBtn: { backgroundColor: '#7C4DFF' },
    btnText: { color: '#fff', fontWeight: 'bold' }
});
