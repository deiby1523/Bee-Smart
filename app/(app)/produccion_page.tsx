import DatePickerField from '@/components/DatePickerField';
import SearchFilter from '@/components/SearchFilter';
import { theme } from '@/constants/theme';
import { apiarioService } from '@/src/services/apiarioService';
import { colmenaService } from '@/src/services/colmenaService';
import { initDatabase } from '@/src/services/database';
import { produccionService } from '@/src/services/produccionService';
import { productoService } from '@/src/services/productoService';
import { Apiario, Colmena, Produccion, Producto } from '@/types/apiario';
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

interface ProduccionWithExtras extends Produccion {
  codigo_colmena?: string;
  apiarioNombre?: string;
  productoNombre?: string;
}

export default function ProduccionPage() {
  const router = useRouter();
  const [producciones, setProducciones] = useState<ProduccionWithExtras[]>([]);
  const [colmenas, setColmenas] = useState<ColmenaWithApiario[]>([]);
  const [apiarios, setApiarios] = useState<Apiario[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // form states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedColmena, setSelectedColmena] = useState<number | null>(null);
  const [selectedProducto, setSelectedProducto] = useState<number | null>(null);
  const [newProductName, setNewProductName] = useState('');
  const [fechaCosecha, setFechaCosecha] = useState('');
  const [cantidad, setCantidad] = useState('');
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

      const prods = await produccionService.getAllProduccion();
      const productosList = await productoService.getAllProductos();
      setProductos(productosList);

      const augmentedProds = prods.map((p) => {
        const col = allColmenas.find((c) => c.id_colmena === p.id_colmena);
        const prod = productosList.find((x) => x.id_producto === p.id_producto);
        return {
          ...p,
          codigo_colmena: col?.codigo_colmena,
          apiarioNombre: col?.apiarioNombre,
          productoNombre: prod?.nombre,
        };
      });
      setProducciones(augmentedProds);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la producción');
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

  const filteredProducciones = React.useMemo(() => {
    let result = [...producciones];
    if (activeFilter) {
      result = result.filter((p) => p.productoNombre === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.codigo_colmena?.toLowerCase().includes(q) ||
          p.productoNombre?.toLowerCase().includes(q) ||
          p.apiarioNombre?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [producciones, activeFilter, searchQuery]);

  const productoFilters = productos.map((p) => ({ id: p.nombre, label: p.nombre }));

  const resetForm = () => {
    setSelectedColmena(null);
    setSelectedProducto(null);
    setFechaCosecha('');
    setCantidad('');
    setObservaciones('');
    setEditingId(null);
  };

  const handleOpenNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedColmena || !selectedProducto || !fechaCosecha || !cantidad) {
      Alert.alert('Error', 'Colmena, producto, fecha y cantidad son requeridos');
      return;
    }
    try {
      const col = colmenas.find((c) => c.id_colmena === selectedColmena);
      const payload = {
        fecha_cosecha: fechaCosecha,
        cantidad: parseFloat(cantidad),
        observaciones: observaciones || undefined,
        id_colmena: selectedColmena,
        id_apiario: col?.id_apiario || null,
        id_producto: selectedProducto,
      } as any;

      if (editingId) {
        await produccionService.updateProduccion(editingId, payload);
        Alert.alert('Éxito', 'Producción actualizada');
      } else {
        await produccionService.createProduccion(payload);
        Alert.alert('Éxito', 'Producción registrada');
      }
      setShowModal(false);
      resetForm();
      await loadData();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la producción');
      console.error(error);
    }
  };

  const handleEdit = (item: ProduccionWithExtras) => {
    resetForm();
    setEditingId(item.id_produccion);
    setSelectedColmena(item.id_colmena);
    setSelectedProducto(item.id_producto);
    setFechaCosecha(item.fecha_cosecha);
    setCantidad(item.cantidad.toString());
    setObservaciones(item.observaciones || '');
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert('Confirmar eliminación', '¿Eliminar esta producción?', [
      { text: 'Cancelar' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await produccionService.deleteProduccion(id);
            await loadData();
            Alert.alert('Éxito', 'Producción eliminada');
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar la producción');
            console.error(error);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: ProduccionWithExtras }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
          <Text style={styles.itemTitle}>{item.codigo_colmena}</Text>
          <Text style={styles.itemDate}>
            {new Date(item.fecha_cosecha).toLocaleDateString()} - {item.cantidad}
          </Text>
          {item.productoNombre && (
            <Text style={styles.productoText}>{item.productoNombre}</Text>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}>
            <Edit2 size={16} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id_produccion)} style={styles.actionBtn}>
            <Trash2 size={16} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
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
        <Text style={styles.headerTitle}>Producción</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleOpenNew}>
          <Plus size={20} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      {loading && producciones.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>Cargando...</Text>
        </View>
      ) : producciones.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No hay registros aún</Text>
        </View>
      ) : (
        <>
          {producciones.length > 0 && (
            <SearchFilter
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              onClearSearch={() => setSearchQuery('')}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              filters={productoFilters}
              placeholder="Buscar producción..."
            />
          )}
          {filteredProducciones.length === 0 ? (
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>No se encontraron registros</Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducciones}
              renderItem={renderItem}
              keyExtractor={(item) => item.id_produccion.toString()}
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
              {editingId ? 'Editar producción' : 'Nuevo registro'}
            </Text>

            <Text style={styles.label}>Colmena</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedColmena}
                onValueChange={(v) => setSelectedColmena(v)}
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

            <Text style={styles.label}>Producto</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedProducto}
                onValueChange={(v) => setSelectedProducto(v)}
              >
                <Picker.Item label="Seleccionar..." value={null} />
                {productos.map((p) => (
                  <Picker.Item
                    key={p.id_producto}
                    label={p.nombre}
                    value={p.id_producto}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Nuevo producto</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.lg }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Nombre"
                value={newProductName}
                onChangeText={setNewProductName}
              />
              <TouchableOpacity
                style={[styles.saveButton, { paddingHorizontal: theme.spacing.md }]}
                onPress={async () => {
                  if (!newProductName.trim()) return;
                  try {
                    const newId = await productoService.createProducto({ nombre: newProductName.trim() });
                    const updated = await productoService.getAllProductos();
                    setProductos(updated);
                    setSelectedProducto(newId);
                    setNewProductName('');
                  } catch (err) {
                    Alert.alert('Error', 'No se pudo crear el producto');
                    console.error(err);
                  }
                }}
              >
                <Text style={styles.saveButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <DatePickerField
              label="Fecha de cosecha"
              value={fechaCosecha}
              onDateChange={setFechaCosecha}
            />

            <Text style={styles.label}>Cantidad</Text>
            <TextInput
              style={styles.input}
              value={cantidad}
              onChangeText={setCantidad}
              keyboardType="numeric"
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
  productoText: {
    fontSize: 12,
    color: theme.colors.darkGray,
    marginTop: theme.spacing.xs,
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
