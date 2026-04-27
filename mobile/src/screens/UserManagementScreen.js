import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    FlatList, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../api/apiClient';

export default function UserManagementScreen({ navigation }) {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('sales');
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/users');
            setUsers(res.data);
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUsers();
        }, [])
    );

    const handleCreateUser = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert('Validation Error', 'Username and password are required');
            return;
        }

        setCreating(true);
        try {
            await apiClient.post('/users', {
                username: username.trim(),
                password: password.trim(),
                role: selectedRole
            });
            Alert.alert('Success', `User "${username}" created as ${selectedRole}`);
            setUsername('');
            setPassword('');
            setSelectedRole('sales');
            fetchUsers();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to create user');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteUser = (user) => {
        Alert.alert(
            'Delete User',
            `Are you sure you want to delete "${user.username}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await apiClient.delete(`/users/${user._id}`);
                            Alert.alert('Success', 'User deleted');
                            fetchUsers();
                        } catch (error) {
                            Alert.alert('Error', error.response?.data?.message || 'Failed to delete user');
                        }
                    }
                }
            ]
        );
    };

    const renderUserItem = ({ item }) => (
        <View style={styles.userRow}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.username}</Text>
                <View style={[styles.roleBadge, { backgroundColor: item.role === 'admin' ? '#7C4DFF' : '#3b82f6' }]}>
                    <Text style={styles.roleBadgeText}>{item.role.toUpperCase()}</Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.deleteUserBtn}
                onPress={() => handleDeleteUser(item)}
            >
                <Text style={styles.deleteUserBtnText}>🗑</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>User Management</Text>
            </View>

            {/* Create User Form */}
            <View style={styles.formCard}>
                <Text style={styles.formTitle}>Create New User</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#666"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#666"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {/* Role Selector */}
                <View style={styles.roleSelector}>
                    <Text style={styles.roleSelectorLabel}>Role:</Text>
                    <TouchableOpacity
                        style={[
                            styles.roleOption,
                            selectedRole === 'sales' && styles.roleOptionActive
                        ]}
                        onPress={() => setSelectedRole('sales')}
                    >
                        <Text style={[
                            styles.roleOptionText,
                            selectedRole === 'sales' && styles.roleOptionTextActive
                        ]}>Sales</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.roleOption,
                            selectedRole === 'admin' && styles.roleOptionActive
                        ]}
                        onPress={() => setSelectedRole('admin')}
                    >
                        <Text style={[
                            styles.roleOptionText,
                            selectedRole === 'admin' && styles.roleOptionTextActive
                        ]}>Admin</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.createBtn}
                    onPress={handleCreateUser}
                    disabled={creating}
                >
                    {creating ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.createBtnText}>Create User</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Existing Users List */}
            <View style={styles.listSection}>
                <Text style={styles.listTitle}>
                    Existing Users ({users.length})
                </Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#7C4DFF" style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item._id}
                        renderItem={renderUserItem}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No users found</Text>
                        }
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0B0F'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#1E1E24'
    },
    backBtn: {
        marginRight: 15
    },
    backBtnText: {
        color: '#7C4DFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    formCard: {
        backgroundColor: '#1E1E24',
        margin: 15,
        padding: 20,
        borderRadius: 15
    },
    formTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15
    },
    input: {
        backgroundColor: '#2A2A35',
        color: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#3a3a4a'
    },
    roleSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 10
    },
    roleSelectorLabel: {
        color: '#aaa',
        fontSize: 14,
        marginRight: 5
    },
    roleOption: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#2A2A35',
        borderWidth: 1,
        borderColor: '#3a3a4a'
    },
    roleOptionActive: {
        backgroundColor: '#7C4DFF',
        borderColor: '#7C4DFF'
    },
    roleOptionText: {
        color: '#aaa',
        fontWeight: 'bold',
        fontSize: 14
    },
    roleOptionTextActive: {
        color: '#fff'
    },
    createBtn: {
        backgroundColor: '#7C4DFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center'
    },
    createBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    listSection: {
        flex: 1,
        paddingHorizontal: 15
    },
    listTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    userRow: {
        backgroundColor: '#1E1E24',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    userName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    roleBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12
    },
    roleBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold'
    },
    deleteUserBtn: {
        padding: 8
    },
    deleteUserBtnText: {
        fontSize: 18
    },
    emptyText: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 20
    }
});
