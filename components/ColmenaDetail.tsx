import DatePickerField from '@/components/DatePickerField';
import StatePickerField from '@/components/StatePickerField';
import { theme } from '@/constants/theme';
import { apiarioService } from '@/src/services/apiarioService';
import { colmenaService } from '@/src/services/colmenaService';
import { inspeccionService } from '@/src/services/inspeccionService';
import { produccionService } from '@/src/services/produccionService';
import { productoService } from '@/src/services/productoService';
import { Apiario, Colmena, Inspeccion, Produccion, Producto } from '@/types/apiario';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Edit2,
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

// extend production type with helper field
interface ProduccionWithExtras extends Produccion {
  productoNombre?: string;
}

interface ColmenaDetailProps {
  colmenaId: number;
  onClose?: () => void; // if provided, component will call this instead of router.back()
}

export default function ColmenaDetail({ colmenaId, onClose }: ColmenaDetailProps) {
  const router = useRouter();
  const [colmena, setColmena] = useState<Colmena | null>(null);
  const [apiario, setApiario] = useState<Apiario | null>(null);
  const [inspecciones, setInspecciones] = useState<Inspeccion[]>([]);
  const [producciones, setProducciones] = useState<ProduccionWithExtras[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // inspection modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fechaInspeccion, setFechaInspeccion] = useState('');
  const [estadoColmena, setEstadoColmena] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // production modal states
  const [showProdModal, setShowProdModal] = useState(false);
  const [prodEditingId, setProdEditingId] = useState<number | null>(null);
  const [prodFecha, setProdFecha] = useState('');
  const [prodCantidad, setProdCantidad] = useState('');
  const [prodObserv, setProdObserv] = useState('');
  const [prodProducto, setProdProducto] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [colmenaId]);

  const loadData = async () => {
    try {
      const col = await colmenaService.getColmenaById(colmenaId);
      if (col) {
        setColmena(col);
        const api = await apiarioService.getApiarioById(col.id_apiario);
        setApiario(api);
        const insps = await inspeccionService.getInspeccionesByColmena(colmenaId);
        setInspecciones(insps);
        const prods = await produccionService.getProduccionByColmena(colmenaId);
        const prodList = await productoService.getAllProductos();
        setProductos(prodList);
        const prodsAug: ProduccionWithExtras[] = prods.map((p) => {
          const prod = prodList.find((x) => x.id_producto === p.id_producto);
          return { ...p, productoNombre: prod?.nombre };
        });
        setProducciones(prodsAug);
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

  // production handlers
  const handleOpenNewProd = () => {
    setProdEditingId(null);
    setProdFecha('');
    setProdCantidad('');
    setProdObserv('');
    setProdProducto(null);
    setShowProdModal(true);
  };

  const handleSaveProd = async () => {
    if (!prodFecha || !prodCantidad || !prodProducto) {
      Alert.alert('Error', 'Fecha, cantidad y producto son requeridos');
      return;
    }
    try {
      const payload = {
        fecha_cosecha: prodFecha,
        cantidad: parseFloat(prodCantidad),
        observaciones: prodObserv || undefined,
        id_colmena: colmena?.id_colmena,
        id_apiario: colmena?.id_apiario,
        id_producto: prodProducto,
      } as any;

      if (prodEditingId) {
        await produccionService.updateProduccion(prodEditingId, payload);
        Alert.alert('Éxito', 'Producción actualizada');
      } else {
        await produccionService.createProduccion(payload);
        Alert.alert('Éxito', 'Producción registrada');
      }
      setShowProdModal(false);
      await loadData();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la producción');
      console.error(error);
    }
  };

  const handleEditProd = (item: ProduccionWithExtras) => {
    setProdEditingId(item.id_produccion);
    setProdFecha(item.fecha_cosecha);
    setProdCantidad(item.cantidad.toString());
    setProdObserv(item.observaciones || '');
    setProdProducto(item.id_producto);
    setShowProdModal(true);
  };

  const handleDeleteProd = (id: number) => {
    Alert.alert('Confirmar eliminar', '¿Borrar este registro de producción?', [
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
          <TouchableOpacity
            onPress={onClose ? onClose : () => router.back()}
            style={styles.backButton}
          >
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
          <TouchableOpacity
            onPress={onClose ? onClose : () => router.back()}
            style={styles.backButton}
          >
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
        <TouchableOpacity
          onPress={onClose ? onClose : () => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{colmena?.codigo_colmena}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {colmena?.foto_url && <Image source={{ uri: colmena.foto_url }} style={styles.colmenaImage} />}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Estado: {colmena?.estado_general || '—'}</Text>
          <Text style={styles.infoText}>Instalación: {colmena ? new Date(colmena.fecha_instalacion).toLocaleDateString() : ''}</Text>
          {apiario && <Text style={styles.infoText}>Apiario: {apiario.nombre}</Text>}
          {colmena?.observaciones && <Text style={styles.infoText}>Obs: {colmena.observaciones}</Text>}
        </View>

        {/* placeholder actions for future features */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.placeholderBtn}
            onPress={() => Alert.alert('Funcionalidad pendiente', 'Registrar tratamiento aún no disponible')}
          >
            <Text style={styles.placeholderText}>Tratamiento</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.placeholderBtn}
            onPress={() => Alert.alert('Funcionalidad pendiente', 'Registrar alimento aún no disponible')}
          >
            <Text style={styles.placeholderText}>Alimento</Text>
          </TouchableOpacity>
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

        {/* Producción section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Producción ({producciones.length})</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleOpenNewProd}>
            <Plus size={20} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        {producciones.length === 0 ? (
          <Text style={styles.emptyText}>Sin registros de producción</Text>
        ) : (
          <FlatList
            data={producciones}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardContent}>
                    <Text style={styles.itemDate}>{new Date(item.fecha_cosecha).toLocaleDateString()}</Text>
                    <Text style={styles.itemDate}>Cant: {item.cantidad}</Text>
                    {item.productoNombre && <Text style={styles.productoText}>{item.productoNombre}</Text>}
                  </View>
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => handleEditProd(item)} style={styles.actionBtn}>
                      <Edit2 size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteProd(item.id_produccion)} style={styles.actionBtn}>
                      <Trash2 size={16} color={theme.colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
                {item.observaciones && <Text style={styles.observaciones}>{item.observaciones}</Text>}
              </View>
            )}
            keyExtractor={(item) => item.id_produccion.toString()}
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

      {/* Production modal */}
      <Modal visible={showProdModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>{prodEditingId ? 'Editar producción' : 'Nueva producción'}</Text>
            <DatePickerField label="Fecha cosecha" value={prodFecha} onDateChange={setProdFecha} />
            <Text style={styles.label}>Producto</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={prodProducto}
                onValueChange={(v) => setProdProducto(v)}
              >
                <Picker.Item label="Seleccionar..." value={null} />
                {productos.map((p) => (
                  <Picker.Item key={p.id_producto} label={p.nombre} value={p.id_producto} />
                ))}
              </Picker>
            </View>
            <Text style={styles.label}>Cantidad</Text>
            <TextInput
              style={styles.input}
              value={prodCantidad}
              onChangeText={setProdCantidad}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              multiline
              value={prodObserv}
              onChangeText={setProdObserv}
              placeholder="Observaciones"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProd}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowProdModal(false)}>
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
  productoText: {
    fontSize: 14,
    color: theme.colors.black,
    marginTop: theme.spacing.xs,
  },
  label: {
    fontSize: 16,
    marginBottom: theme.spacing.xs,
    color: theme.colors.black,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
    borderRadius: 8,
    marginBottom: theme.spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: theme.spacing.md,
  },
  placeholderBtn: {
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.sm,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
  },
  placeholderText: {
    color: theme.colors.white,
    fontWeight: '600',
  },
});