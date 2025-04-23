import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, PermissionsAndroid, Platform, AsyncStorage } from 'react-native';
import SmsListener from 'react-native-android-sms-listener';
import PushNotification from 'react-native-push-notification';
import natural from 'natural';

// Simple NLP-based analysis logic
const analyzeMessage = (message, settings) => {
  let result = 'Safe';
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(message.toLowerCase());

  // Flagging based on keyword matches and settings
  if (settings.threats && words.includes('bomb')) result = 'Threat';
  else if (settings.fakeNews && words.includes('click here to win')) result = 'Fake News';
  else if (settings.sensitive && words.includes('confidential')) result = 'Sensitive';

  return result;
};

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

export default function App() {
  const [lastMessage, setLastMessage] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [settings, setSettings] = useState({ threats: true, fakeNews: true, sensitive: true });

  useEffect(() => {
    requestPermissions();

    // Load settings from AsyncStorage
    const loadSettings = async () => {
      const savedSettings = await AsyncStorage.getItem('settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    };

    loadSettings();

    const subscription = SmsListener.addListener(message => {
      setLastMessage(message.body);
      const result = analyzeMessage(message.body, settings);
      setAnalysis(result);

      // Store flagged messages locally
      if (result !== 'Safe') {
        AsyncStorage.getItem('flaggedMessages').then(flaggedMessages => {
          const messages = flaggedMessages ? JSON.parse(flaggedMessages) : [];
          messages.push({ message: message.body, result });
          AsyncStorage.setItem('flaggedMessages', JSON.stringify(messages));
        });
      }

      PushNotification.localNotification({
        title: 'Message Sentinel Alert',
        message: `Content flagged as: ${result}`,
      });
    });

    return () => subscription.remove();
  }, [settings]);

  const toggleSetting = async (setting) => {
    const updatedSettings = { ...settings, [setting]: !settings[setting] };
    setSettings(updatedSettings);
    await AsyncStorage.setItem('settings', JSON.stringify(updatedSettings));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Message Sentinel</Text>
      <Text>Last Message: {lastMessage}</Text>
      <Text>Analysis: {analysis}</Text>
      <Button title="Toggle Threats" onPress={() => toggleSetting('threats')} />
      <Button title="Toggle Fake News" onPress={() => toggleSetting('fakeNews')} />
      <Button title="Toggle Sensitive" onPress={() => toggleSetting('sensitive')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 20 },
});
