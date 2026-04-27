import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import apiClient from '../api/apiClient';

export default function SegmentRulesScreen({ navigation }) {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const res = await apiClient.get('/rules');
            setRules(res.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch rules');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id, minPurchase, maxPurchase, discountRate) => {
        setSavingId(id);
        try {
            await apiClient.put(`/rules/${id}`, { 
                minPurchase: Number(minPurchase), 
                maxPurchase: Number(maxPurchase), 
                discountRate: Number(discountRate) 
            });
            Alert.alert('Success', 'Rule updated successfully');
        } catch (error) {
            Alert.alert('Validation Error', error.response?.data?.message || 'Failed to update rule');
        } finally {
            setSavingId(null);
        }
    };

    const updateLocalState = (id, field, value) => {
        setRules(prev => prev.map(r => r._id === id ? { ...r, [field]: value } : r));
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#7C4DFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Segment Rules</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        Rules define customer segments based on Total Purchase Amount. Ranges must NOT overlap. Changes update all customer segments dynamically.
                    </Text>
                </View>

                {rules.map(rule => (
                    <View key={rule._id} style={styles.ruleCard}>
                        <View style={styles.ruleHeader}>
                            <Text style={styles.ruleName}>{rule.name} Segment</Text>
                            <View style={[styles.badge, { backgroundColor: rule.name === 'Platinum' ? '#a855f7' : rule.name === 'Gold' ? '#fbbf24' : '#3b82f6' }]} />
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Min Purchase ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={String(rule.minPurchase)}
                                onChangeText={(val) => updateLocalState(rule._id, 'minPurchase', val)}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Max Purchase ($)</Text>
                            <TextInput
                                style={styles.input}
                                value={String(rule.maxPurchase)}
                                onChangeText={(val) => updateLocalState(rule._id, 'maxPurchase', val)}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Discount Rate (%)</Text>
                            <TextInput
                                style={styles.input}
                                value={String(rule.discountRate)}
                                onChangeText={(val) => updateLocalState(rule._id, 'discountRate', val)}
                                keyboardType="numeric"
                            />
                        </View>

                        <TouchableOpacity 
                            style={styles.saveBtn} 
                            onPress={() => handleUpdate(rule._id, rule.minPurchase, rule.maxPurchase, rule.discountRate)}
                            disabled={savingId === rule._id}
                        >
                            {savingId === rule._id ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Rule</Text>}
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B0B0F' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#1E1E24' },
    backBtn: { marginRight: 15 },
    backBtnText: { color: '#7C4DFF', fontSize: 16, fontWeight: 'bold' },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    scrollContent: { padding: 15 },
    infoBox: { backgroundColor: '#2A2A35', padding: 15, borderRadius: 10, marginBottom: 20 },
    infoText: { color: '#aaa', fontSize: 14, lineHeight: 20 },
    ruleCard: { backgroundColor: '#1E1E24', padding: 20, borderRadius: 15, marginBottom: 20 },
    ruleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    ruleName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    badge: { width: 12, height: 12, borderRadius: 6 },
    inputGroup: { marginBottom: 15 },
    label: { color: '#aaa', fontSize: 12, marginBottom: 5 },
    input: { backgroundColor: '#2A2A35', color: '#fff', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#3a3a4a' },
    saveBtn: { backgroundColor: '#7C4DFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 5 },
    saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
