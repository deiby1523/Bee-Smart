import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
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

  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
    onDateChange(selectedDate.toISOString().split('T')[0]);
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

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Seleccionar Fecha</Text>
              <TouchableOpacity
                onPress={() => {
                  handleDateChange(date);
                  setShowPicker(false);
                }}
              >
                <Text style={styles.confirmText}>Aceptar</Text>
              </TouchableOpacity>
            </View>

            <DatePicker
              date={date}
              onDateChange={setDate}
              mode="date"
              locale="es"
              style={styles.picker}
            />
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  cancelText: {
    fontSize: 14,
    color: theme.colors.darkGray,
    fontWeight: '600',
  },
  confirmText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  picker: {
    height: 220,
  },
});
