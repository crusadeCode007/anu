import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const statusColor = {
  Pending: '#d97706',
  Approved: '#059669',
  Rejected: '#dc2626'
};

export default function ReviewCard({ review, isAdmin, onApprove, onReject, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.name}>{review.customerName}</Text>
          <Text style={styles.meta}>
            {review.category} • {review.rating}/5 stars
          </Text>
        </View>
        <Text style={[styles.status, { color: statusColor[review.status] }]}>{review.status}</Text>
      </View>

      {!!review.customerEmail && <Text style={styles.email}>{review.customerEmail}</Text>}
      <Text style={styles.comment}>{review.comment}</Text>
      <Text style={styles.created}>Created by {review.createdBy?.username || 'user'}</Text>

      {isAdmin && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.button, styles.approve]} onPress={() => onApprove(review)}>
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.reject]} onPress={() => onReject(review)}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.delete]} onPress={() => onDelete(review)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    marginBottom: 12
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12
  },
  titleWrap: {
    flex: 1
  },
  name: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800'
  },
  meta: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 3
  },
  email: {
    color: '#2563eb',
    fontSize: 12,
    marginTop: 8
  },
  status: {
    fontSize: 12,
    fontWeight: '800'
  },
  comment: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10
  },
  created: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 8
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12
  },
  button: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 9
  },
  approve: {
    backgroundColor: '#059669'
  },
  reject: {
    backgroundColor: '#d97706'
  },
  delete: {
    backgroundColor: '#dc2626'
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  }
});
