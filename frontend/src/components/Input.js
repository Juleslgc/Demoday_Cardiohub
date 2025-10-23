import React, { useState } from "react";
// Import basic React Native components
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    // Main container of the field
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.star}>*</Text>}
        </Text> )}

      {/* Input container with icon */}
      <View style={[styles.inputContainer, error && styles.errorInput]}>
        <TextInput
          style={styles.textInput} // Red border if error
          value={value} // Current value of the field
          onChangeText={onChangeText} // Function called when entering
          secureTextEntry={secureTextEntry && !isPasswordVisible} // Hides the text if true
          placeholder={placeholder} // Indicative text
          placeholderTextColor="#C2BDBD" // Placeholder color
          scrollEnabled={false} // Prevent scrolling in the input
        />

        {/* Eye button */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.iconContainer}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        )}

      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// Component styles
const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { marginBottom: 5, fontWeight: 'bold', color: '#042456' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#042456',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  textInput: { flex: 1, paddingVertical: 10, fontFamily: 'Nunito' },
  iconContainer: { marginLeft: 5},
  
  errorInput: { borderColor: 'red' },
  errorText: { color: 'red', marginTop: 5, fontFamily: 'Nunito' },
  star: { color: 'red' }
});
