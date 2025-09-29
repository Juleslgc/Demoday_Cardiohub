import React from "react";
// Import basic React Native components
import { TextInput, View, Text, StyleSheet } from "react-native";

// Reusable Input component
// Props:
// - label: text displayed above the input field
// - value: current value of the field
// - onChangeText: function called on each keystroke to update the value
// - secureTextEntry: hides the text (for passwords)
// - error: error message to display if the input is invalid
export default function Input({ label, value, onChangeText, secureTextEntry, error, placeholder, required }) {
  return (
    // Main container of the field
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.star}>*</Text>}
        </Text> )}
      <TextInput
        style={[styles.input, error && styles.errorInput]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor="#C2BDBD"
        scrollEnabled={false}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// Component styles
const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { marginBottom: 5, fontWeight: 'bold', color: '#042456' },
  input: { borderWidth: 1, borderColor: '#042456', padding: 10, borderRadius: 5, fontFamily: 'Nunito' },
  errorInput: { borderColor: 'red' },
  errorText: { color: 'red', marginTop: 5, fontFamily: 'Nunito' },
  star: { color: 'red' }
});
