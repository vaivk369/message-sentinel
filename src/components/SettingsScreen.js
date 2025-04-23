import React from 'react';
import { View, Text, Button, StyleSheet, AsyncStorage } from 'react-native';

const SettingsScreen = ({ settings, setSettings }) => {
  const toggleSetting = async (setting) => {
    const updatedSettings = { ...settings, [setting]: !settings[setting] };
    setSettings(updatedSettings);
    await AsyncStorage.setItem('settings', JSON.stringify(updatedSettings));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Button title={`Toggle Threats: ${settings.threats ? 'On' : 'Off'}`} onPress={() => toggleSetting('threats')} />
      <Button title={`Toggle Fake News: ${settings.fakeNews ? 'On' : 'Off'}`} onPress={() => toggleSetting('fakeNews')} />
      <Button title={`Toggle Sensitive: ${settings.sensitive ? 'On' : 'Off'}`} onPress={() => toggleSetting('sensitive')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 20 },
});

export default SettingsScreen;
