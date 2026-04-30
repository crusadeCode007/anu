import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationCard({ item, isAdmin, onRead, onDelete }) {
  return (
    <View style={[styles.card, !item.isRead && styles.unread]}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>
            {item.type} • {item.targetRole}
          </Text>
        </View>
        {!item.isRead && <View style={styles.dot} />}
      </View>
      <Text style={styles.message}>{item.message}</Text>
      <View style={styles.actions}>
        {!item.isRead && (
          <TouchableOpacity style={styles.readButton} onPress={() => onRead(item)}>
            <Text style={styles.readText}>Mark read</Text>
          </TouchableOpacity>
        )}
        {isAdmin && (
          <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
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
  unread: {
    borderColor: '#93c5fd',
    backgroundColor: '#eff6ff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  titleWrap: {
    flex: 1
  },
  title: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800'
  },
  meta: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 3
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563eb'
  },
  message: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12
  },
  readButton: {
    backgroundColor: '#2563eb',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  readText: {
    color: '#ffffff',
    fontWeight: '800'
  },
  deleteText: {
    color: '#b91c1c',
    fontWeight: '800'
  }
});
