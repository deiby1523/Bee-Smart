import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ChevronDown } from 'lucide-react-native';
import { theme } from '@/constants/theme';

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
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[styles.stateText, !value && styles.placeholderText]}>
          {value || 'Seleccionar estado'}
        </Text>
        <ChevronDown size={18} color={theme.colors.primary} />
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.headerTitle}>Seleccionar Estado</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Picker
              selectedValue={value}
              onValueChange={(itemValue) => {
                if (itemValue !== '') {
                  onStateChange(itemValue);
                  setShowPicker(false);
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
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.mediumGray,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.black,
  },
  closeText: {
    fontSize: 24,
    color: theme.colors.darkGray,
  },
  picker: {
    height: 220,
  },
});
