import React from "react";
// Import basic React Native components
import { TextInput, View, Text, StyleSheet } from "react-native";

/**
* Reusable "Input" component
*
* Props:
* - label: Text displayed above the field
* - value: Current value of the field
* - onChangeText: Function called upon each change to update the value
* - secureTextEntry: Hides the text (useful for passwords)
* - error: Error message displayed if the field is invalid
* - placeholder: Text displayed when no value is entered
* - required: Indicates whether the field is required (displays an *)
*
* How it works:
* - Displays a label with an * if the field is required
* - Changes the border color if an error is present
* - Displays an error message below the field
*/
export default function Input({ label, value, onChangeText, secureTextEntry, error, placeholder, required }) {
  return (
    // Main container of the field
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.star}>*</Text>}
        </Text> )}
      <TextInput
        style={[styles.input, error && styles.errorInput]} // Red border if error
        value={value} // Current value of the field
        onChangeText={onChangeText} // Function called when entering
        secureTextEntry={secureTextEntry} // Hides the text if true
        placeholder={placeholder} // Indicative text
        placeholderTextColor="#C2BDBD" // Placeholder color
        scrollEnabled={false} // Prevent scrolling in the input
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
