import { StyleSheet, Text, View } from 'react-native';

export default function StatCard({ label, value, tone = 'blue' }) {
  return (
    <View style={[styles.card, styles[tone]]}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 82,
    borderRadius: 8,
    padding: 14,
    justifyContent: 'center',
    borderWidth: 1
  },
  blue: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe'
  },
  green: {
    backgroundColor: '#ecfdf5',
    borderColor: '#bbf7d0'
  },
  amber: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a'
  },
  red: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca'
  },
  value: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '800'
  },
  label: {
    color: '#4b5563',
    fontSize: 12,
    marginTop: 4
  }
});
