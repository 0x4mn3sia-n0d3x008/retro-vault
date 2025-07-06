import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import PasswordItem from '../components/PasswordItem';
import colors from '../styles/colors';

export default function HomeScreen() {
  const [site, setSite] = useState('');
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState([]);

  const addPassword = () => {
    if (site && password) {
      setPasswords([...passwords, { site, password }]);
      setSite('');
      setPassword('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Brabim Retro Vault</Text>
      <TextInput
        style={styles.input}
        placeholder="Website"
        placeholderTextColor="#00FF00"
        value={site}
        onChangeText={setSite}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#00FF00"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Add Password" onPress={addPassword} color={colors.accent} />
      <FlatList
        data={passwords}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <PasswordItem site={item.site} password={item.password} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: colors.greenText,
    fontFamily: 'VT323',
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.inputBg,
    color: colors.greenText,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    fontFamily: 'VT323',
  },
});
