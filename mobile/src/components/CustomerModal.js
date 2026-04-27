import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { getImageUrl } from '../api/apiClient';

export default function CustomerModal({ visible, customer, onClose, onEdit, onDelete, role }) {
    if (!customer) return null;
    
    const avatarUrl = getImageUrl(customer.profileImageUrl);
    const isAdmin = role === 'admin';

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Customer Details</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeBtn}>X</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileSection}>
                        {avatarUrl ? (
                            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>
                                    {customer.companyName ? customer.companyName.charAt(0).toUpperCase() : 'C'}
                                </Text>
                            </View>
                        )}
                        <Text style={styles.companyName}>{customer.companyName}</Text>
                        <Text style={styles.customerId}>{customer.customerId}</Text>
                    </View>

                    <View style={styles.detailsSection}>
                        <DetailRow label="Email" value={customer.email} />
                        <DetailRow label="Phone" value={customer.phone} />
                        {customer.country ? <DetailRow label="Country" value={customer.country} /> : null}
                        <DetailRow label="Total Purchases" value={`$${(customer.totalPurchaseAmount || 0).toLocaleString()}`} />
                        <DetailRow label="Segment" value={customer.segment || 'Normal'} />
                        <DetailRow label="Discount Rate" value={`${customer.discountRate || 0}%`} />
                    </View>

                    {isAdmin ? (
                        <View style={styles.actionSection}>
                            <TouchableOpacity style={[styles.btn, styles.editBtn]} onPress={onEdit}>
                                <Text style={styles.btnText}>Edit Info</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, styles.deleteBtn]} onPress={onDelete}>
                                <Text style={styles.btnText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.readOnlyBanner}>
                            <Text style={styles.readOnlyText}>👁 View Only Mode</Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        padding: 20
    },
    card: {
        backgroundColor: '#1E1E24',
        borderRadius: 15,
        padding: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    closeBtn: { color: '#aaa', fontSize: 18, fontWeight: 'bold', padding: 5 },
    profileSection: { alignItems: 'center', marginBottom: 20 },
    avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
    avatarPlaceholder: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: '#3a3a4a',
        justifyContent: 'center', alignItems: 'center', marginBottom: 10
    },
    avatarText: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
    companyName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    customerId: { color: '#7C4DFF', fontSize: 14, marginTop: 4 },
    detailsSection: { backgroundColor: '#2A2A35', padding: 15, borderRadius: 10, marginBottom: 20 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    detailLabel: { color: '#aaa', fontSize: 14 },
    detailValue: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
    actionSection: { flexDirection: 'row', justifyContent: 'space-between' },
    btn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
    editBtn: { backgroundColor: '#3b82f6' },
    deleteBtn: { backgroundColor: '#ef4444' },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    readOnlyBanner: { backgroundColor: '#2A2A35', padding: 12, borderRadius: 8, alignItems: 'center' },
    readOnlyText: { color: '#aaa', fontSize: 14 }
});
