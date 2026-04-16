import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getImageUrl } from '../api/apiClient';

export default function CustomerCard({ customer, onPress }) {
    const avatarUrl = getImageUrl(customer.profileImageUrl);

    const getBadgeColor = (segment) => {
        switch (segment) {
            case 'Platinum': return '#a855f7';
            case 'Gold': return '#fbbf24';
            case 'Normal': return '#3b82f6';
            default: return '#666';
        }
    };

    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(customer)}>
            <View style={styles.avatarContainer}>
                {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                            {customer.companyName ? customer.companyName.charAt(0).toUpperCase() : 'C'}
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.companyName} numberOfLines={1}>{customer.companyName || 'Unknown'}</Text>
                <Text style={styles.customerId}>{customer.customerId}</Text>
                <Text style={styles.amount}>${(customer.totalPurchaseAmount || 0).toLocaleString()}</Text>
            </View>
            <View style={styles.badgeContainer}>
                <View style={[styles.badge, { backgroundColor: getBadgeColor(customer.segment) }]}>
                    <Text style={styles.badgeText}>{customer.segment || 'Normal'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#1E1E24',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        alignItems: 'center'
    },
    avatarContainer: {
        marginRight: 15
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3a3a4a',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    infoContainer: {
        flex: 1
    },
    companyName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    customerId: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 2
    },
    amount: {
        color: '#22c55e',
        fontSize: 14,
        marginTop: 4,
        fontWeight: '600'
    },
    badgeContainer: {
        justifyContent: 'center'
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold'
    }
});
