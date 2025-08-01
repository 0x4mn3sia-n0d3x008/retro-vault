// App.js
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [screen, setScreen] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [label, setLabel] = useState('');
  const [vaultPassword, setVaultPassword] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          setUserExists(true);
          setScreen('login');
        } else {
          setUserExists(false);
          setScreen('register');
        }
      } catch (error) {
        console.log('Error checking user:', error);
      }
    };
    checkUser();
  }, []);

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
    try {
      await AsyncStorage.setItem('user', JSON.stringify({ username, password }));
      setUserExists(true);
      setScreen('vault');
    } catch (error) {
      console.log('Registration failed:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        const { username: savedUsername, password: savedPassword } = JSON.parse(savedUser);
        if (username === savedUsername && password === savedPassword) {
          setScreen('vault');
        } else {
          Alert.alert('Error', 'Invalid credentials');
        }
      }
    } catch (e) {
      console.log('Login failed:', e);
    }
  };

  useEffect(() => {
    const loadPasswords = async () => {
      try {
        const saved = await AsyncStorage.getItem('passwords');
        if (saved) setPasswords(JSON.parse(saved));
      } catch (e) {
        console.log('Failed to load passwords:', e);
      }
    };
    if (screen === 'vault') loadPasswords();
  }, [screen]);

  useEffect(() => {
    const savePasswords = async () => {
      try {
        await AsyncStorage.setItem('passwords', JSON.stringify(passwords));
      } catch (e) {
        console.log('Failed to save passwords:', e);
      }
    };
    if (screen === 'vault') savePasswords();
  }, [passwords]);

  const addOrUpdatePassword = () => {
    if (!label.trim() || !vaultPassword.trim()) {
      Alert.alert('Oops!', 'Please fill both Label and Password');
      return;
    }
    if (editIndex !== null) {
      const updated = [...passwords];
      updated[editIndex] = { label, password: vaultPassword };
      setPasswords(updated);
      setEditIndex(null);
    } else {
      setPasswords([...passwords, { label, password: vaultPassword }]);
    }
    setLabel('');
    setVaultPassword('');
  };

  const editPassword = (index) => {
    setLabel(passwords[index].label);
    setVaultPassword(passwords[index].password);
    setEditIndex(index);
  };

  const deletePassword = (index) => {
    Alert.alert('Delete', 'Are you sure you want to delete this password?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const filtered = passwords.filter((_, i) => i !== index);
          setPasswords(filtered);
          if (editIndex === index) {
            setEditIndex(null);
            setLabel('');
            setVaultPassword('');
          }
        },
      },
    ]);
  };

  if (!screen) return null;

  if (screen === 'register') {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.header}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === 'login') {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.header}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
          value={vaultPassword}
          onChangeText={setVaultPassword}
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

      <ScrollView style={{ width: '100%', marginTop: 30 }}>
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
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
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
    fontFamily: 'Courier',
    textShadowColor: '#00FF00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    textAlign: 'center',
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
    fontFamily: 'Courier',
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
    fontFamily: 'Courier',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#003300',
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#00FF00',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Courier',
  },
  lockButton: {
    backgroundColor: '#003300',
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 50,
    marginTop: 10,
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
  },
  passwordLabel: {
    color: '#00FF00',
    fontFamily: 'Courier',
    fontSize: 20,
    marginBottom: 6,
    fontWeight: '600',
  },
  passwordText: {
    color: '#00FF00',
    fontFamily: 'Courier',
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
});
