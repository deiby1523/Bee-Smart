import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface DatePickerFieldProps {
  label: string;
  value: string;
  onDateChange: (date: string) => void;
  placeholder?: string;
}

export default function DatePickerField({
  label,
  value,
  onDateChange,
  placeholder = 'Seleccionar fecha',
}: DatePickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(
    value ? new Date(value) : new Date()
  );

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
      onDateChange(selectedDate.toISOString().split('T')[0]);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return placeholder;
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
      >
        <Calendar size={18} color={theme.colors.primary} />
        <Text style={[styles.dateText, !value && styles.placeholderText]}>
          {formatDate(value)}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          locale="es-ES"
        />
      )}
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
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.lightGray,
    gap: theme.spacing.sm,
  },
  dateText: {
    fontSize: 14,
    color: theme.colors.black,
    flex: 1,
  },
  placeholderText: {
    color: theme.colors.mediumGray,
  },
});
