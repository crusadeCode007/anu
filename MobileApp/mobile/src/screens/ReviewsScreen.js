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
import ReviewCard from '../components/ReviewCard';
import StatCard from '../components/StatCard';

const emptyForm = {
  customerName: '',
  customerEmail: '',
  rating: '5',
  category: 'Service',
  comment: ''
};

const statuses = ['All', 'Pending', 'Approved', 'Rejected'];

export default function ReviewsScreen({ user }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const isAdmin = user?.role === 'admin';

  const loadData = useCallback(async () => {
    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (status !== 'All') {
      params.status = status;
    }

    const [reviewsResponse, statsResponse] = await Promise.all([
      apiClient.get('/reviews', { params }),
      apiClient.get('/reviews/stats')
    ]);
    setReviews(reviewsResponse.data);
    setStats(statsResponse.data);
  }, [search, status]);

  useEffect(() => {
    loadData()
      .catch((error) => Alert.alert('Failed to load reviews', error.response?.data?.message || 'Try again.'))
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

  const submitReview = async () => {
    const ratingValue = Number(form.rating);

    if (!form.customerName || !form.comment) {
      Alert.alert('Missing details', 'Customer name and comment are required.');
      return;
    }

    if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      Alert.alert('Invalid rating', 'Please enter a rating from 1 to 5.');
      return;
    }

    try {
      await apiClient.post('/reviews', {
        ...form,
        rating: ratingValue
      });
      setForm(emptyForm);
      setModalVisible(false);
      refresh();
    } catch (error) {
      Alert.alert('Save failed', error.response?.data?.message || 'Try again.');
    }
  };

  const updateStatus = async (review, status) => {
    await apiClient.put(`/reviews/${review._id}`, { status });
    refresh();
  };

  const deleteReview = (review) => {
    Alert.alert('Delete review', `Delete ${review.customerName}'s review?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await apiClient.delete(`/reviews/${review._id}`);
          refresh();
        }
      }
    ]);
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
        data={reviews}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Customer Reviews</Text>
                <Text style={styles.subtitle}>{isAdmin ? 'Admin review control' : 'Sales review entry'}</Text>
              </View>
              <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addText}>Add</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.statsRow}>
              <StatCard label="Total" value={stats?.total || 0} />
              <StatCard label="Avg rating" value={stats?.averageRating || 0} tone="green" />
            </View>
            <View style={styles.statsRow}>
              <StatCard label="Pending" value={stats?.statuses?.Pending || 0} tone="amber" />
              <StatCard label="Approved" value={stats?.statuses?.Approved || 0} tone="green" />
              <StatCard label="Rejected" value={stats?.statuses?.Rejected || 0} tone="red" />
            </View>
            <TextInput
              autoCapitalize="none"
              style={styles.searchInput}
              placeholder="Search customer, email, or comment"
              value={search}
              onChangeText={setSearch}
            />
            <View style={styles.filterRow}>
              {statuses.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.filterButton, status === item && styles.filterActive]}
                  onPress={() => setStatus(item)}
                >
                  <Text style={[styles.filterText, status === item && styles.filterActiveText]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ReviewCard
            review={item}
            isAdmin={isAdmin}
            onApprove={(review) => updateStatus(review, 'Approved')}
            onReject={(review) => updateStatus(review, 'Rejected')}
            onDelete={deleteReview}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No reviews found.</Text>}
      />

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Review</Text>
          <TextInput
            style={styles.input}
            placeholder="Customer name"
            value={form.customerName}
            onChangeText={(value) => setForm((current) => ({ ...current, customerName: value }))}
          />
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            placeholder="Customer email"
            value={form.customerEmail}
            onChangeText={(value) => setForm((current) => ({ ...current, customerEmail: value }))}
          />
          <TextInput
            keyboardType="number-pad"
            maxLength={1}
            style={styles.input}
            placeholder="Rating 1-5"
            value={form.rating}
            onChangeText={(value) => setForm((current) => ({ ...current, rating: value }))}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Comment"
            value={form.comment}
            onChangeText={(value) => setForm((current) => ({ ...current, comment: value }))}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={submitReview}>
            <Text style={styles.primaryText}>Save Review</Text>
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
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14
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
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 15,
    marginBottom: 10,
    padding: 12
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  filterButton: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  filterActive: {
    backgroundColor: '#111827',
    borderColor: '#111827'
  },
  filterText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '800'
  },
  filterActiveText: {
    color: '#ffffff'
  },
  empty: {
    color: '#6b7280',
    marginTop: 28,
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
    minHeight: 130,
    textAlignVertical: 'top'
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
