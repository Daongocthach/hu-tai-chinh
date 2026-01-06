import { useEmails } from '@/hooks'
import { Button, StyleSheet, Text, View } from 'react-native'

export default function HomeScreen() {
  const { emails, add, loading, refresh } = useEmails()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SQLite Sample (Email)</Text>

      <Button title="Add Email" onPress={() => { add(`user${Date.now()}@example.com`) }} />

      {emails.map(item => (
        <Text key={item.id} style={styles.item}>
          {item.email}
        </Text>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  item: {
    paddingVertical: 4,
  },
})
