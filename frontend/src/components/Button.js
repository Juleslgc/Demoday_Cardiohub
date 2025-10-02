import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// Reusable "Button" component
// Properties:
// - title: text of the button
// - onPress: function called when clicked
// - variant: 'full' (filled, default) or 'outline' (outline only)
// - disabled: disables the button
export default function Button({title, onPress, variant = 'full', disabled, icon}) {
    return (
      <TouchableOpacity
        // Dynamic style application:
        // - base style
        // - depending on the button type (filled or outline)
        // - if disabled, the style also changes
        style={[
          styles.button,
          variant === 'full' ? styles.full : styles.outline,
          disabled && styles.disabledButton
        ]}
        onPress={onPress} // triggers the action passed as a prop
        disabled={disabled} // Prevents pressing if disabled
        >
          {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={variant === 'outline' ? '#042456' : '#fff'}
          style={{ marginRight: 8 }}
        />
      )}
          <Text
            // Text style:
            // - default style
            // - if it's an "outline" button, the text should be blue instead of white
            style={[
              styles.text,
              variant === 'outline' && styles.outlineText
            ]}
          >
            {title}
          </Text>
        </TouchableOpacity>
    );
}
// Button and text styles
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  full: {
    backgroundColor: '#042456',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#042456',
  },
  disabledButton: {
    backgroundColor: '#aaa',
    borderColor: '#aaa',
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Nunito',
  },
  outlineText: {
    color: '#042456'
  },
});