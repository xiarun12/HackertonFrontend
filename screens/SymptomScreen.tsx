import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function SymptomScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>증상을 말씀해 주세요</Text>
      <TextInput
        style={styles.input}
        placeholder="증상을 입력하세요"
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { height: 150, borderColor: '#ccc', borderWidth: 1, borderRadius: 10, padding: 10, textAlignVertical: 'top' },
});
