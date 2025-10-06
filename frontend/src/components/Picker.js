import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

/**
* Reusable "StyledPicker" component
*
* Props:
* - label: Text displayed above the picker
* - selectedValue: Currently selected value
* - onValueChange: Function called each time the value changes
* - options: Array of options (label, value) to display in the Picker
* - error: Error message displayed if the selection is invalid
* - required: Indicates whether the field is required (displays an *)
*
* How it works:
* - Displays a label with an * if the field is required
* - Changes the border color if an error occurs
* - Displays an error message below the Picker
* - Displays the options passed in the `options` prop
*/
export default function StyledPicker({ label, selectedValue, onValueChange, options, error, required}) {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.star}>*</Text>}
        </Text>
      )}

      <View style={[styles.pickerContainer, error && styles.errorInput]}>
        <Picker
          selectedValue={selectedValue} // currently selected value
          onValueChange={onValueChange} // function called on change
          style={styles.picker} // Picker text style
        >
          {options.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// Styles of the StyledPicker component
const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { marginBottom: 5, fontWeight: "bold", color: "#042456", fontFamily: "Nunito" },

  // "Input" style
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#042456",
    borderRadius: 5,
    overflow: "hidden", // so that the Picker does not overflow
    height: 50,
    justifyContent: "center"
  },
  picker: {
    fontFamily: "Nunito",
    color: "#042456", // Picker text
    fontSize: 12,
  },

  errorInput: { borderColor: "red" },
  errorText: { color: "red", marginTop: 5, fontFamily: "Nunito" },
  star: { color: 'red' }
});