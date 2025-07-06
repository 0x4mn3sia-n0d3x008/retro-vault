import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function App() {
  const [label, setLabel] = useState('');
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const addOrUpdatePassword = () => {
    if (!label.trim() || !password.trim()) {
      Alert.alert('Oops!', 'Please fill both Label and Password');
      return;
    }

    if (editIndex !== null) {
      const updated = [...passwords];
      updated[editIndex] = { label, password };
      setPasswords(updated);
      setEditIndex(null);
    } else {
      setPasswords([...passwords, { label, password }]);
    }
    setLabel('');
    setPassword('');
  };

  const editPassword = (index) => {
    setLabel(passwords[index].label);
    setPassword(passwords[index].password);
    setEditIndex(index);
  };

  const deletePassword = (index) => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this password?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          const filtered = passwords.filter((_, i) => i !== index);
          setPasswords(filtered);
          if(editIndex === index) {
            setEditIndex(null);
            setLabel('');
            setPassword('');
          }
        }}
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Retro Vault</Text>
        <Text style={styles.icon}>🥷</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Label</Text>
        <TextInput
          style={styles.input}
          value={label}
          onChangeText={setLabel}
          placeholder="Enter label"
          placeholderTextColor="#003300"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          placeholderTextColor="#003300"
          secureTextEntry
          autoCapitalize="none"
          onSubmitEditing={addOrUpdatePassword}
          returnKeyType="done"
        />
      </View>

      <TouchableOpacity style={styles.lockButton} onPress={addOrUpdatePassword}>
        <Text style={styles.lockIcon}>🔐</Text>
      </TouchableOpacity>

      <ScrollView style={{width: '100%', marginTop: 30}}>
        {passwords.map((item, index) => (
          <View key={index} style={styles.passwordContainer}>
            <Text style={styles.passwordLabel}>{item.label}</Text>
            <Text style={styles.passwordText}>{item.password}</Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => editPassword(index)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deletePassword(index)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  header: {
    fontSize: 32,
    color: '#00FF00',
    fontWeight: 'bold',
    fontFamily: '"Lucida Console", "Courier New", monospace',
    textShadowColor: '#00FF00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  icon: {
    fontSize: 32,
    marginLeft: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 25,
  },
  label: {
    fontSize: 18,
    color: '#00FF00',
    fontFamily: '"Lucida Console", "Courier New", monospace',
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#00FF00',
    backgroundColor: '#001100',
    color: '#00FF00',
    padding: 12,
    borderRadius: 6,
    fontFamily: '"Lucida Console", "Courier New", monospace',
    fontSize: 16,
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  lockButton: {
    backgroundColor: '#003300',
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 50,
    marginTop: 10,
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    alignSelf: 'flex-start',
  },
  lockIcon: {
    color: '#00FF00',
    fontSize: 24,
  },
  passwordContainer: {
    backgroundColor: '#001100',
    borderWidth: 1,
    borderColor: '#00FF00',
    padding: 15,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
  },
  passwordLabel: {
    color: '#00FF00',
    fontFamily: '"Lucida Console", "Courier New", monospace',
    fontSize: 20,
    marginBottom: 6,
    fontWeight: '600',
  },
  passwordText: {
    color: '#00FF00',
    fontFamily: '"Lucida Console", "Courier New", monospace',
    fontSize: 18,
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#004400',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#660000',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: '#00FF00',
    fontWeight: 'bold',
    fontFamily: '"Lucida Console", "Courier New", monospace',
    fontSize: 16,
  },
});
