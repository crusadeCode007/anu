import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ReviewsScreen from './src/screens/ReviewsScreen';

const Tab = createBottomTabNavigator();

function Header({ user, onLogout }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>{user.username}</Text>
        <Text style={styles.headerRole}>{user.role}</Text>
      </View>
      <TouchableOpacity style={styles.logout} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('user')
      .then((storedUser) => {
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      })
      .finally(() => setBooting(false));
  }, []);

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    setUser(null);
  };

  if (booting) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  if (!user) {
    return (
      <>
        <StatusBar style="dark" />
        <LoginScreen onLogin={setUser} />
      </>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Header user={user} onLogout={logout} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#111827',
          tabBarInactiveTintColor: '#6b7280'
        }}
      >
        <Tab.Screen name="Reviews">{() => <ReviewsScreen user={user} />}</Tab.Screen>
        <Tab.Screen name="Notifications">{() => <NotificationsScreen user={user} />}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 54
  },
  headerTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900'
  },
  headerRole: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
    textTransform: 'uppercase'
  },
  logout: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  logoutText: {
    color: '#111827',
    fontWeight: '800'
  }
});
