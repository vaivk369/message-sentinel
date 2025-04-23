import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import SmsListener from 'react-native-android-sms-listener';
import PushNotification from 'react-native-push-notification';

const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      ]);
      return granted;
    } catch (err) {
      console.warn(err);
    }
  }
};

const analyzeMessage = (message) => {
  if (message.includes("bomb")) return "Threat";
  if (message.includes("click here to win")) return "Fake News";
  if (message.includes("confidential")) return "Sensitive";
  return "Safe";
};

export default function App() {
  const [lastMessage, setLastMessage] = useState("");
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    requestPermissions();

    const subscription = SmsListener.addListener(message => {
      setLastMessage(message.body);
      const result = analyzeMessage(message.body);
      setAnalysis(result);
      PushNotification.localNotification({
        title: "Message Sentinel Alert",
        message: `Content flagged as: ${result}`,
      });
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Message Sentinel</Text>
      <Text>Last Message: {lastMessage}</Text>
      <Text>Analysis: {analysis}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  title: { fontSize: 24, marginBottom: 20 }
});
