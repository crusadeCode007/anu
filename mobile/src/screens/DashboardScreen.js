import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../api/apiClient';
import CustomerCard from '../components/CustomerCard';
import PieChartComponent from '../components/PieChartComponent';
import CustomerModal from '../components/CustomerModal';
import CustomerEditModal from '../components/CustomerEditModal';
import CustomerCreateModal from '../components/CustomerCreateModal';

export default function DashboardScreen({ navigation }) {
    const [customers, setCustomers] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modals state
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);

    const fetchData = async (pageNum = 1, searchQuery = search) => {
        try {
            setLoading(true);
            const [custRes, dashRes] = await Promise.all([
                apiClient.get(`/customers?page=${pageNum}&limit=7&search=${searchQuery}`),
                apiClient.get('/dashboard')
            ]);
            
            if (pageNum === 1) {
                setCustomers(custRes.data.customers);
            } else {
                setCustomers(prev => [...prev, ...custRes.data.customers]);
            }
            
            setTotalPages(custRes.data.totalPages);
            setDashboardData(dashRes.data);
            setPage(pageNum);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData(1, search);
        }, [search])
    );

    const handleSearch = (text) => {
        setSearch(text);
        // fetchData is called by useFocusEffect when search changes
    };

    const loadMore = () => {
        if (page < totalPages && !loading) {
            fetchData(page + 1, search);
        }
    };

    const handleCustomerPress = (customer) => {
        setSelectedCustomer(customer);
        setViewModalVisible(true);
    };

    const handleDelete = async () => {
        Alert.alert('Confirm', 'Delete this customer?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await apiClient.delete(`/customers/${selectedCustomer._id}`);
                        setViewModalVisible(false);
                        fetchData(1, search);
                        Alert.alert('Success', 'Customer deleted');
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete');
                    }
                }
            }
        ]);
    };

    const handleAddPurchase = async () => {
        Alert.prompt('Add Purchase', 'Enter amount to add:', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Add',
                onPress: async (amount) => {
                    if (!amount || isNaN(amount) || Number(amount) <= 0) {
                        Alert.alert('Error', 'Invalid amount');
                        return;
                    }
                    try {
                        const res = await apiClient.post(`/customers/${selectedCustomer._id}/purchase`, { amount });
                        setSelectedCustomer(res.data);
                        fetchData(1, search); // Refresh list to update segment/sorting
                        Alert.alert('Success', 'Purchase amount added');
                    } catch (error) {
                        Alert.alert('Error', 'Failed to add purchase');
                    }
                }
            }
        ], 'plain-text');
    };

    const openEditModal = () => {
        setViewModalVisible(false);
        setEditModalVisible(true);
    };

    const handleUpdateCustomer = (updatedCustomer) => {
        setEditModalVisible(false);
        setSelectedCustomer(updatedCustomer);
        setViewModalVisible(true);
        fetchData(1, search);
    };

    const handleCreateCustomer = (newCustomer) => {
        fetchData(1, search);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dashboard</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity onPress={() => navigation.navigate('SegmentRules')} style={styles.headerBtn}>
                        <Text style={styles.headerBtnText}>⚙️ Rules</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.headerBtn}>
                        <Text style={styles.headerBtnText}>🚪 Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.actionRow}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search company..."
                    placeholderTextColor="#666"
                    value={search}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity style={styles.createBtn} onPress={() => setCreateModalVisible(true)}>
                    <Text style={styles.createBtnText}>+ New</Text>
                </TouchableOpacity>
            </View>

            {dashboardData && <PieChartComponent data={dashboardData.pieChartData} />}

            <View style={styles.listContainer}>
                <Text style={styles.listTitle}>Top Customers</Text>
                {loading && page === 1 ? (
                    <ActivityIndicator size="large" color="#7C4DFF" style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={customers}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => <CustomerCard customer={item} onPress={handleCustomerPress} />}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={loading && page > 1 ? <ActivityIndicator color="#7C4DFF" /> : null}
                        ListEmptyComponent={<Text style={{ color: '#aaa', textAlign: 'center', marginTop: 20 }}>No customers found</Text>}
                    />
                )}
            </View>

            {/* Modals */}
            <CustomerModal
                visible={viewModalVisible}
                customer={selectedCustomer}
                onClose={() => setViewModalVisible(false)}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onAddPurchase={handleAddPurchase}
            />

            <CustomerEditModal
                visible={editModalVisible}
                customer={selectedCustomer}
                onClose={() => setEditModalVisible(false)}
                onUpdate={handleUpdateCustomer}
            />

            <CustomerCreateModal
                visible={createModalVisible}
                onClose={() => setCreateModalVisible(false)}
                onCreate={handleCreateCustomer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B0B0F', padding: 15 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingTop: 30 },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    headerButtons: { flexDirection: 'row', gap: 10 },
    headerBtn: { backgroundColor: '#1E1E24', padding: 8, borderRadius: 8 },
    headerBtnText: { color: '#fff', fontSize: 12 },
    actionRow: { flexDirection: 'row', marginBottom: 15, gap: 10 },
    searchBar: { flex: 1, backgroundColor: '#2A2A35', color: '#fff', borderRadius: 8, paddingHorizontal: 15, height: 45 },
    createBtn: { backgroundColor: '#7C4DFF', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 8 },
    createBtnText: { color: '#fff', fontWeight: 'bold' },
    listContainer: { flex: 1 },
    listTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }
});
