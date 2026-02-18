import DatePickerField from '@/components/DatePickerField';
import SearchFilter from '@/components/SearchFilter';
import StatePickerField from '@/components/StatePickerField';
import { theme } from '@/constants/theme';
import { apiarioService } from '@/src/services/apiarioService';
import { colmenaService } from '@/src/services/colmenaService';
import { initDatabase } from '@/src/services/database';
import { inspeccionService } from '@/src/services/inspeccionService';
import { Apiario, Colmena, Inspeccion } from '@/types/apiario';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useRouter } from 'expo-router';
import { Edit2, Plus, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ColmenaWithApiario extends Colmena {
  apiarioNombre?: string;
}

interface InspeccionWithExtras extends Inspeccion {
  codigo_colmena?: string;
  apiarioNombre?: string;
}

export default function InspeccionesPage() {
  const router = useRouter();
  const [inspecciones, setInspecciones] = useState<InspeccionWithExtras[]>([]);
  const [colmenas, setColmenas] = useState<ColmenaWithApiario[]>([]);
  const [apiarios, setApiarios] = useState<Apiario[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedColmena, setSelectedColmena] = useState<number | null>(null);
  const [fechaInspeccion, setFechaInspeccion] = useState('');
  const [estadoColmena, setEstadoColmena] = useState('');
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      await initDatabase();
      const apiariosData = await apiarioService.getAllApiarios();
      setApiarios(apiariosData);

      const allColmenas: ColmenaWithApiario[] = [];
      for (const apiario of apiariosData) {
        const cols = await colmenaService.getColmenasByApiario(apiario.id_apiario);
        const augmented = cols.map((c) => ({ ...c, apiarioNombre: apiario.nombre }));
        allColmenas.push(...augmented);
      }
      setColmenas(allColmenas);

      const insps = await inspeccionService.getAllInspecciones();
      const inspsAug = insps.map((i) => {
        const col = allColmenas.find((c) => c.id_colmena === i.id_colmena);
        return {
          ...i,
          codigo_colmena: col?.codigo_colmena,
          apiarioNombre: col?.apiarioNombre,
        };
      });
      setInspecciones(inspsAug);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las inspecciones');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const filteredInspecciones = React.useMemo(() => {
    let result = [...inspecciones];
    if (activeFilter) {
      result = result.filter((i) => i.estado_colmena === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.codigo_colmena?.toLowerCase().includes(q) ||
          i.observaciones?.toLowerCase().includes(q) ||
          i.apiarioNombre?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [inspecciones, activeFilter, searchQuery]);

  const estadosUnicos = React.useMemo(() => {
    const setEstados = new Set(
      inspecciones
        .map((i) => i.estado_colmena)
        .filter((e): e is string => !!e)
    );
    return Array.from(setEstados).sort();
  }, [inspecciones]);

  const estadoFilters = estadosUnicos.map((e) => ({ id: e, label: e }));

  const resetForm = () => {
    setSelectedColmena(null);
    setFechaInspeccion('');
    setEstadoColmena('');
    setObservaciones('');
    setEditingId(null);
  };

  const handleOpenNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedColmena || !fechaInspeccion) {
      Alert.alert('Error', 'Colmena y fecha son requeridas');
      return;
    }
    try {
      const payload = {
        fecha_inspeccion: fechaInspeccion,
        estado_colmena: estadoColmena || undefined,
        observaciones: observaciones || undefined,
        id_colmena: selectedColmena,
      } as any;

      if (editingId) {
        await inspeccionService.updateInspeccion(editingId, payload);
        Alert.alert('Éxito', 'Inspección actualizada');
      } else {
        await inspeccionService.createInspeccion(payload);
        Alert.alert('Éxito', 'Inspección creada');
      }

      // si se especificó un estado para la colmena, reflejarlo en el registro de la colmena
      if (estadoColmena && selectedColmena) {
        try {
          await colmenaService.updateColmena(selectedColmena, { estado_general: estadoColmena });
        } catch (err) {
          console.error('No se pudo actualizar estado de colmena:', err);
        }
      }
      setShowModal(false);
      resetForm();
      await loadData();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la inspección');
      console.error(error);
    }
  };

  const handleEdit = (item: InspeccionWithExtras) => {
    resetForm();
    setEditingId(item.id_inspeccion);
    setSelectedColmena(item.id_colmena);
    setFechaInspeccion(item.fecha_inspeccion);
    setEstadoColmena(item.estado_colmena || '');
    setObservaciones(item.observaciones || '');
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert('Confirmar eliminación', '¿Desea eliminar esta inspección?', [
      { text: 'Cancelar' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await inspeccionService.deleteInspeccion(id);
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

  const renderItem = ({ item }: { item: InspeccionWithExtras }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
          <Text style={styles.itemTitle}>{item.codigo_colmena}</Text>
          <Text style={styles.itemDate}>
            {new Date(item.fecha_inspeccion).toLocaleDateString()}
          </Text>
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
      {item.estado_colmena && (
        <View style={styles.estadoBadge}>
          <Text style={styles.estadoText}>{item.estado_colmena}</Text>
        </View>
      )}
      {item.observaciones && (
        <Text style={styles.observaciones} numberOfLines={2}>
          {item.observaciones}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inspecciones</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleOpenNew}>
          <Plus size={20} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      {loading && inspecciones.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>Cargando...</Text>
        </View>
      ) : inspecciones.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No hay inspecciones aún</Text>
        </View>
      ) : (
        <>
          {inspecciones.length > 0 && (
            <SearchFilter
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              onClearSearch={() => setSearchQuery('')}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              filters={estadoFilters}
              placeholder="Buscar inspección..."
            />
          )}
          {filteredInspecciones.length === 0 ? (
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>No se encontraron inspecciones</Text>
            </View>
          ) : (
            <FlatList
              data={filteredInspecciones}
              renderItem={renderItem}
              keyExtractor={(item) => item.id_inspeccion.toString()}
              contentContainerStyle={styles.listContent}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          )}
        </>
      )}

      {/* Modal form */}
      <Modal visible={showModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? 'Editar inspección' : 'Nueva inspección'}
            </Text>

            <Text style={styles.label}>Colmena</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedColmena}
                onValueChange={(value) => setSelectedColmena(value)}
              >
                <Picker.Item label="Seleccionar..." value={null} />
                {colmenas.map((c) => (
                  <Picker.Item
                    key={c.id_colmena}
                    label={`${c.codigo_colmena} (${c.apiarioNombre})`}
                    value={c.id_colmena}
                  />
                ))}
              </Picker>
            </View>

            <DatePickerField
              label="Fecha"
              value={fechaInspeccion}
              onDateChange={setFechaInspeccion}
            />

            <StatePickerField
              label="Estado"
              value={estadoColmena}
              onStateChange={setEstadoColmena}
            />

            <Text style={styles.label}>Observaciones</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              multiline
              value={observaciones}
              onChangeText={setObservaciones}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowModal(false)}
            >
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.darkGray,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {},
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.black,
  },
  itemDate: {
    fontSize: 12,
    color: theme.colors.darkGray,
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    marginLeft: theme.spacing.sm,
  },
  estadoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 8,
    marginTop: theme.spacing.sm,
  },
  estadoText: {
    color: theme.colors.white,
    fontSize: 12,
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
    padding: theme.spacing.md,
    backgroundColor: theme.colors.lightGray,
    marginBottom: theme.spacing.lg,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
    borderRadius: 8,
    backgroundColor: theme.colors.lightGray,
    marginBottom: theme.spacing.lg,
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