import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import apiClient from '../api/apiClient';
import NotificationCard from '../components/NotificationCard';

export default function NotificationsScreen({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', targetRole: 'all' });

  const isAdmin = user?.role === 'admin';

  const loadData = useCallback(async () => {
    const { data } = await apiClient.get('/notifications');
    setNotifications(data);
  }, []);

  useEffect(() => {
    loadData()
      .catch((error) => Alert.alert('Failed to load notifications', error.response?.data?.message || 'Try again.'))
      .finally(() => setLoading(false));
  }, [loadData]);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  const markRead = async (item) => {
    await apiClient.put(`/notifications/${item._id}/read`);
    refresh();
  };

  const markAllRead = async () => {
    await apiClient.put('/notifications/read-all');
    refresh();
  };

  const createNotification = async () => {
    if (!form.title || !form.message) {
      Alert.alert('Missing details', 'Title and message are required.');
      return;
    }

    await apiClient.post('/notifications', { ...form, type: 'info' });
    setForm({ title: '', message: '', targetRole: 'all' });
    setModalVisible(false);
    refresh();
  };

  const deleteNotification = async (item) => {
    await apiClient.delete(`/notifications/${item._id}`);
    refresh();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Notifications</Text>
                <Text style={styles.subtitle}>{notifications.filter((item) => !item.isRead).length} unread</Text>
              </View>
              {isAdmin && (
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                  <Text style={styles.addText}>New</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.readAllButton} onPress={markAllRead}>
              <Text style={styles.readAllText}>Mark all as read</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <NotificationCard item={item} isAdmin={isAdmin} onRead={markRead} onDelete={deleteNotification} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No notifications yet.</Text>}
      />

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modal}>
          <Text style={styles.title}>Create Notification</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={form.title}
            onChangeText={(value) => setForm((current) => ({ ...current, title: value }))}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Message"
            value={form.message}
            onChangeText={(value) => setForm((current) => ({ ...current, message: value }))}
          />
          <View style={styles.segment}>
            {['all', 'admin', 'sales'].map((role) => (
              <TouchableOpacity
                key={role}
                style={[styles.segmentButton, form.targetRole === role && styles.segmentActive]}
                onPress={() => setForm((current) => ({ ...current, targetRole: role }))}
              >
                <Text style={[styles.segmentText, form.targetRole === role && styles.segmentActiveText]}>{role}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={createNotification}>
            <Text style={styles.primaryText}>Send Notification</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.secondaryText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  list: {
    padding: 16,
    paddingBottom: 28
  },
  headerWrap: {
    marginBottom: 12
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '900'
  },
  subtitle: {
    color: '#6b7280',
    marginTop: 3
  },
  addButton: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  addText: {
    color: '#ffffff',
    fontWeight: '800'
  },
  readAllButton: {
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    marginTop: 12,
    paddingVertical: 10
  },
  readAllText: {
    color: '#111827',
    fontWeight: '800'
  },
  empty: {
    color: '#6b7280',
    marginTop: 30,
    textAlign: 'center'
  },
  modal: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
    paddingTop: 70
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    marginTop: 12,
    padding: 13
  },
  textArea: {
    minHeight: 150,
    textAlignVertical: 'top'
  },
  segment: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 11
  },
  segmentActive: {
    backgroundColor: '#111827',
    borderColor: '#111827'
  },
  segmentText: {
    color: '#374151',
    fontWeight: '800'
  },
  segmentActiveText: {
    color: '#ffffff'
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    marginTop: 16,
    paddingVertical: 14
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '900'
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 14
  },
  secondaryText: {
    color: '#374151',
    fontWeight: '800'
  }
});
