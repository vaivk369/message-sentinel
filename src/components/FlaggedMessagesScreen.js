import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, AsyncStorage } from 'react-native';

const FlaggedMessagesScreen = () => {
  const [flaggedMessages, setFlaggedMessages] = useState([]);

  useEffect(() => {
    const loadFlaggedMessages = async () => {
      const messages = await AsyncStorage.getItem('flaggedMessages');
      setFlaggedMessages(messages ? JSON.parse(messages) : []);
    };

    loadFlaggedMessages();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flagged Messages</Text>
      {flaggedMessages.length === 0 ? (
        <Text>No flagged messages</Text>
      ) : (
        flaggedMessages.map((msg, index) => (
          <View key={index} style={styles.message}>
            <Text>{msg.message}</Text>
            <Text>Flagged as: {msg.result}</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 20 },
  message: { marginBottom: 20, padding: 10, borderColor: 'gray', borderWidth: 1 },
});

export default FlaggedMessagesScreen;
