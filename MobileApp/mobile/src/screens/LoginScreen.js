import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import apiClient from '../api/apiClient';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.post('/auth/login', { username, password });
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (error) {
      Alert.alert('Login failed', error.response?.data?.message || 'Check API IP and backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ERP Reviews</Text>
      <Text style={styles.subtitle}>Review and notification module</Text>

      <TextInput
        autoCapitalize="none"
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        secureTextEntry
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <Text style={styles.hint}>Demo: admin/admin123 or sales/sales123</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f9fafb'
  },
  title: {
    color: '#111827',
    fontSize: 32,
    fontWeight: '900'
  },
  subtitle: {
    color: '#4b5563',
    fontSize: 15,
    marginBottom: 28,
    marginTop: 6
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 12,
    padding: 14
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    marginTop: 4,
    paddingVertical: 14
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800'
  },
  hint: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 14,
    textAlign: 'center'
  }
});
