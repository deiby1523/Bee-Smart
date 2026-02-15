import { theme } from '@/constants/theme';
import { Picker } from '@react-native-picker/picker';
import { ChevronDown } from 'lucide-react-native';
import React, { useRef } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface StatePickerFieldProps {
  label: string;
  value: string;
  onStateChange: (state: string) => void;
  options?: string[];
}

const DEFAULT_STATES = ['Activo', 'Débil', 'Fuerte', 'Vuelo', 'Enjambre', 'Colapsada'];

export default function StatePickerField({
  label,
  value,
  onStateChange,
  options = DEFAULT_STATES,
}: StatePickerFieldProps) {
  const pickerRef = useRef<Picker<string>>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => {
          // Trigger picker directly
          pickerRef.current?.focus();
        }}
      >
        <Text style={[styles.stateText, !value && styles.placeholderText]}>
          {value || 'Seleccionar estado'}
        </Text>
        <ChevronDown size={18} color={theme.colors.primary} />
      </TouchableOpacity>

      {/* Hidden picker that opens when input is pressed */}
      <Picker
        ref={pickerRef}
        selectedValue={value}
        onValueChange={(itemValue) => {
          if (itemValue !== '') {
            onStateChange(itemValue);
          }
        }}
        style={styles.picker}
      >
        <Picker.Item label="Seleccionar estado..." value="" />
        {options.map((state) => (
          <Picker.Item key={state} label={state} value={state} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.lightGray,
  },
  stateText: {
    fontSize: 14,
    color: theme.colors.black,
    flex: 1,
  },
  placeholderText: {
    color: theme.colors.mediumGray,
  },
  picker: {
    height: 0,
    display: 'none',
  },
});
