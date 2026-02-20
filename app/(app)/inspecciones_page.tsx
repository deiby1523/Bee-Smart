import DatePickerField from '@/components/DatePickerField';
import Header from '@/components/Header';
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
import { ChevronRight, ClipboardList, Plus } from 'lucide-react-native';
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

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedColmena, setSelectedColmena] = useState<number | null>(null);
  const [fechaInspeccion, setFechaInspeccion] = useState('');
  const [estadoColmena, setEstadoColmena] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const handleCancelEdit = () => {
    setEditingId(null);
    setSelectedColmena(null);
    setFechaInspeccion('');
    setEstadoColmena('');
    setObservaciones('');
    setShowModal(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, []),
  );

  const loadData = async () => {
    try {
      await initDatabase();
      const apiariosData = await apiarioService.getAllApiarios();
      setApiarios(apiariosData);

      const allColmenas: ColmenaWithApiario[] = [];
      for (const apiario of apiariosData) {
        const cols = await colmenaService.getColmenasByApiario(
          apiario.id_apiario,
        );
        const augmented = cols.map((c) => ({
          ...c,
          apiarioNombre: apiario.nombre,
        }));
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

  const handleEdit = (item: InspeccionWithExtras) => {
    setEditingId(item.id_inspeccion);
    setSelectedColmena(item.id_colmena);
    setFechaInspeccion(item.fecha_inspeccion);
    setEstadoColmena(item.estado_colmena || '');
    setObservaciones(item.observaciones || '');
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Eliminar inspección', '¿Deseas eliminar esta inspección?', [
      { text: 'Cancelar' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await inspeccionService.deleteInspeccion(id);
            await loadData();
            setShowModal(false);
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar');
          }
        },
      },
    ]);
  };
  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };
  const handleSave = async () => {
    if (!selectedColmena || !fechaInspeccion) {
      Alert.alert('Error', 'Colmena y fecha son obligatorias');
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
      } else {
        await inspeccionService.createInspeccion(payload);
      }

      // actualizar estado general de colmena si se definió
      if (estadoColmena) {
        try {
          await colmenaService.updateColmena(selectedColmena, {
            estado_general: estadoColmena,
          });
        } catch (err) {
          console.error('No se pudo actualizar estado de colmena', err);
        }
      }

      setShowModal(false);
      setEditingId(null);
      setSelectedColmena(null);
      setFechaInspeccion('');
      setEstadoColmena('');
      setObservaciones('');

      await loadData();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la inspección');
      console.error(error);
    }
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
          i.apiarioNombre?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [inspecciones, activeFilter, searchQuery]);

  const estadosUnicos = React.useMemo(() => {
    const estados = new Set(
      inspecciones.map((i) => i.estado_colmena).filter((e): e is string => !!e),
    );

    return ['Todos', ...Array.from(estados)];
  }, [inspecciones]);

  const renderItem = ({ item }: { item: InspeccionWithExtras }) => {
    const isCompletado = item.estado_colmena?.toLowerCase() === 'completado';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => handleEdit(item)}
      >
        <View style={styles.iconBox}>
          <ClipboardList size={26} color={theme.colors.primary} />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.title}>
            {item.codigo_colmena || 'Inspección'}
          </Text>

          <Text style={styles.subtitle}>
            {new Date(item.fecha_inspeccion).toLocaleDateString()} ·{' '}
            {item.apiarioNombre}
          </Text>

          {item.estado_colmena && (
            <View style={styles.estadoRow}>
              <View
                style={[
                  styles.estadoDot,
                  {
                    backgroundColor: isCompletado ? '#2ECC71' : '#F39C12',
                  },
                ]}
              />
              <Text
                style={[
                  styles.estadoText,
                  {
                    color: isCompletado ? '#2ECC71' : '#F39C12',
                  },
                ]}
              >
                {item.estado_colmena}
              </Text>
            </View>
          )}
        </View>

        <ChevronRight size={20} color="#999" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inspecciones Guardadas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowModal(true)}
        >
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <SearchFilter
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        filters={[]}
        placeholder="Buscar reportes..."
      />

      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {estadosUnicos.map((estado) => {
            const isActive =
              (estado === 'Todos' && !activeFilter) || activeFilter === estado;

            return (
              <TouchableOpacity
                key={estado}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() =>
                  setActiveFilter(estado === 'Todos' ? null : estado)
                }
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {estado}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredInspecciones}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_inspeccion.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingTop: 10 }}
      />

      {/* Modal igual al anterior */}
      <Modal visible={showModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={styles.modalTitle}>Nueva inspección</Text>
              {editingId && (
                <TouchableOpacity
                  onPress={handleCancelEdit}
                  style={styles.backEditContainer}
                >
                  <Text style={styles.backEditText}>← Cancelar edición</Text>
                </TouchableOpacity>
              )}
            </View>
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
              style={styles.input}
              multiline
              value={observaciones}
              onChangeText={setObservaciones}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>
                {editingId ? 'Actualizar' : 'Guardar'}
              </Text>
            </TouchableOpacity>

            {editingId && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(editingId)}
              >
                <Text style={styles.deleteButtonText}>Eliminar inspección</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F2F2F2',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },

  addButton: {
    position: 'absolute',
    right: 16,
    top: 10,
    backgroundColor: theme.colors.primary,
    padding: 8,
    borderRadius: 8,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F6E3CF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  cardContent: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  subtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },

  estadoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  estadoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  estadoText: {
    fontSize: 13,
    fontWeight: '500',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  modalContent: {
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    height: 80,
    marginBottom: 20,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginBottom: 20,
  },

  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },

  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  cancelButton: {
    alignItems: 'center',
    padding: 14,
  },

  cancelButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },

  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  backEditContainer: {
    marginBottom: 10,
  },

  backEditText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  rowView: {
    flexDirection: 'row',
  },
  filtersWrapper: {
    height: 50, // 🔥 esto evita que se estire
    justifyContent: 'center',
  },

  filtersContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EAEAEA',
    marginRight: 10,
    alignSelf: 'center', // 🔥 evita estiramiento
  },

  filterChipActive: {
    backgroundColor: theme.colors.primary,
  },

  filterText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },

  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
