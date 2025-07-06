import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function PasswordItem({ site, password }) {
  return (
    <View style={styles.item}>
      <Text style={styles.text}>🌐 {site}</Text>
      <Text style={styles.text}>🔑 {password}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  text: {
    color: colors.greenText,
    fontFamily: 'VT323',
    fontSize: 18,
  },
});
