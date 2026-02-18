import PhotoPicker from '@/components/PhotoPicker';
import DatePickerField from '@/components/DatePickerField';
import StatePickerField from '@/components/StatePickerField';
import { theme } from '@/constants/theme';
import { apiarioService } from '@/src/services/apiarioService';
import { colmenaService } from '@/src/services/colmenaService';
import { inspeccionService } from '@/src/services/inspeccionService';
import { Apiario, Colmena, Inspeccion } from '@/types/apiario';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Calendar,
  ChevronLeft,
  Edit2,
  MapPin,
  Plus,
  Trash2,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ColmenaDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [colmena, setColmena] = useState<Colmena | null>(null);
  const [apiario, setApiario] = useState<Apiario | null>(null);
  const [inspecciones, setInspecciones] = useState<Inspeccion[]>([]);
  const [loading, setLoading] = useState(true);

  // inspection modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fechaInspeccion, setFechaInspeccion] = useState('');
  const [estadoColmena, setEstadoColmena] = useState('');
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const idNum = typeof id === 'string' ? parseInt(id) : (Array.isArray(id) ? parseInt(id[0]) : 0);
      const col = await colmenaService.getColmenaById(idNum);
      if (col) {
        setColmena(col);
        const api = await apiarioService.getApiarioById(col.id_apiario);
        setApiario(api);
        const insps = await inspeccionService.getInspeccionesByColmena(idNum);
        setInspecciones(insps);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la colmena');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFechaInspeccion('');
    setEstadoColmena('');
    setObservaciones('');
  };

  const handleOpenNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!fechaInspeccion.trim()) {
      Alert.alert('Error', 'La fecha es requerida');
      return;
    }
    try {
      const payload = {
        fecha_inspeccion: fechaInspeccion,
        estado_colmena: estadoColmena || undefined,
        observaciones: observaciones || undefined,
        id_colmena: colmena?.id_colmena,
      } as any;

      if (editingId) {
        await inspeccionService.updateInspeccion(editingId, payload);
        Alert.alert('Éxito', 'Inspección actualizada');
      } else {
        await inspeccionService.createInspeccion(payload);
        Alert.alert('Éxito', 'Inspección creada');
      }

      // actualizar estado general de la colmena
      if (estadoColmena && colmena) {
        await colmenaService.updateColmena(colmena.id_colmena, { estado_general: estadoColmena });
      }

      setShowModal(false);
      resetForm();
      await loadData();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la inspección');
      console.error(error);
    }
  };

  const handleEdit = (item: Inspeccion) => {
    resetForm();
    setEditingId(item.id_inspeccion);
    setFechaInspeccion(item.fecha_inspeccion);
    setEstadoColmena(item.estado_colmena || '');
    setObservaciones(item.observaciones || '');
    setShowModal(true);
  };

  const handleDelete = (id_ins: number) => {
    Alert.alert('Confirmar eliminar', '¿Borrar esta inspección?', [
      { text: 'Cancelar' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await inspeccionService.deleteInspeccion(id_ins);
            await loadData();
            Alert.alert('Éxito', 'Inspección eliminada');
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar la inspección');
            console.error(error);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Inspeccion }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
          <Text style={styles.itemDate}>{new Date(item.fecha_inspeccion).toLocaleDateString()}</Text>
          {item.estado_colmena && <Text style={styles.estadoText}>{item.estado_colmena}</Text>}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}>
            <Edit2 size={16} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id_inspeccion)} style={styles.actionBtn}>
            <Trash2 size={16} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      {item.observaciones && <Text style={styles.observaciones}>{item.observaciones}</Text>}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={theme.colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cargando...</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
    );
  }

  if (!colmena) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={theme.colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>No encontrado</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{colmena.codigo_colmena}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {colmena.foto_url && <Image source={{ uri: colmena.foto_url }} style={styles.colmenaImage} />}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Estado: {colmena.estado_general || '—'}</Text>
          <Text style={styles.infoText}>Instalación: {new Date(colmena.fecha_instalacion).toLocaleDateString()}</Text>
          {apiario && <Text style={styles.infoText}>Apiario: {apiario.nombre}</Text>}
          {colmena.observaciones && <Text style={styles.infoText}>Obs: {colmena.observaciones}</Text>}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Inspecciones ({inspecciones.length})</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleOpenNew}>
            <Plus size={20} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        {inspecciones.length === 0 ? (
          <Text style={styles.emptyText}>Sin inspecciones registradas</Text>
        ) : (
          <FlatList
            data={inspecciones}
            renderItem={renderItem}
            keyExtractor={(item) => item.id_inspeccion.toString()}
            contentContainerStyle={styles.listContent}
          />
        )}
      </ScrollView>

      <Modal visible={showModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Editar inspección' : 'Nueva inspección'}</Text>
            <DatePickerField label="Fecha" value={fechaInspeccion} onDateChange={setFechaInspeccion} />
            <StatePickerField label="Estado" value={estadoColmena} onStateChange={setEstadoColmena} />
            <TextInput
              style={[styles.input, { height: 80 }]}
              multiline
              value={observaciones}
              onChangeText={setObservaciones}
              placeholder="Observaciones"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.mediumGray,
  },
  backButton: {
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  content: {
    padding: theme.spacing.md,
  },
  colmenaImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    backgroundColor: theme.colors.mediumGray,
    marginBottom: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: 8,
  },
  emptyText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.darkGray,
    textAlign: 'center',
    marginVertical: theme.spacing.md,
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {},
  itemDate: {
    fontSize: 14,
    color: theme.colors.black,
  },
  estadoText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    marginLeft: theme.spacing.sm,
  },
  observaciones: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.darkGray,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  modalContent: {
    padding: theme.spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
    borderRadius: 8,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.lightGray,
    marginBottom: theme.spacing.md,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  cancelButton: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});