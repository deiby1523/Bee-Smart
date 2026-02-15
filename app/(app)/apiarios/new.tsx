import PhotoPicker from '@/components/PhotoPicker';
import DatePickerField from '@/components/DatePickerField';
import { theme } from '@/constants/theme';
import { apiarioService } from '@/src/services/apiarioService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditApiarioScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isNew = id === undefined || id === 'new';

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [fotoUrl, setFotoUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      loadApiario();
    }
  }, [id]);

  const loadApiario = async () => {
    try {
      const idNum = typeof id === 'string' ? parseInt(id) : (Array.isArray(id) ? parseInt(id[0]) : 0);
      const apiario = await apiarioService.getApiarioById(idNum);
      if (apiario) {
        setNombre(apiario.nombre);
        setDescripcion(apiario.descripcion || '');
        setMunicipio(apiario.municipio || '');
        setLatitud(apiario.latitud ? apiario.latitud.toString() : '');
        setLongitud(apiario.longitud ? apiario.longitud.toString() : '');
        setFotoUrl(apiario.foto_url || '');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el apiario');
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    setLoading(true);
    try {
      const apiarioData = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        municipio: municipio.trim() || undefined,
        latitud: latitud ? parseFloat(latitud) : undefined,
        longitud: longitud ? parseFloat(longitud) : undefined,
        foto_url: fotoUrl || undefined,
        fecha_creacion: isNew ? new Date().toISOString() : undefined,
      };

      if (isNew) {
        await apiarioService.createApiario(apiarioData as any);
        Alert.alert('Éxito', 'Apiario creado correctamente');
      } else {
        const idNum = typeof id === 'string' ? parseInt(id) : (Array.isArray(id) ? parseInt(id[0]) : 0);
        await apiarioService.updateApiario(idNum, apiarioData as any);
        Alert.alert('Éxito', 'Apiario actualizado correctamente');
      }

      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el apiario');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isNew ? 'Nuevo Apiario' : 'Editar Apiario'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <PhotoPicker
          photoUri={fotoUrl}
          onPhotoSelected={setFotoUrl}
          onPhotoRemoved={() => setFotoUrl('')}
          label="Foto del Apiario"
        />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del apiario"
            value={nombre}
            onChangeText={setNombre}
            placeholderTextColor={theme.colors.mediumGray}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descripción del apiario"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
            placeholderTextColor={theme.colors.mediumGray}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Municipio</Text>
          <TextInput
            style={styles.input}
            placeholder="Municipio"
            value={municipio}
            onChangeText={setMunicipio}
            placeholderTextColor={theme.colors.mediumGray}
          />
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Latitud</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 37.7749"
              value={latitud}
              onChangeText={setLatitud}
              keyboardType="decimal-pad"
              placeholderTextColor={theme.colors.mediumGray}
            />
          </View>

          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Longitud</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: -122.4194"
              value={longitud}
              onChangeText={setLongitud}
              keyboardType="decimal-pad"
              placeholderTextColor={theme.colors.mediumGray}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Guardando...' : isNew ? 'Crear' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.mediumGray,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.black,
    backgroundColor: theme.colors.lightGray,
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: theme.spacing.md,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.lightGray,
  },
  cancelButtonText: {
    color: theme.colors.black,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
