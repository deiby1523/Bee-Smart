import ColmenaDetail from '@/components/ColmenaDetail';
import DatePickerField from '@/components/DatePickerField';
import PhotoPicker from '@/components/PhotoPicker';
import StatePickerField from '@/components/StatePickerField';
import { theme } from '@/constants/theme';
import { apiarioService } from '@/src/services/apiarioService';
import { colmenaService } from '@/src/services/colmenaService';
import { inspeccionService } from '@/src/services/inspeccionService';
import { Apiario, Colmena } from '@/types/apiario';
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

export default function ApiarioDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [apiario, setApiario] = useState<Apiario | null>(null);
  const [colmenas, setColmenas] = useState<Colmena[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewColmenaModal, setShowNewColmenaModal] = useState(false);
  const [editingColmenaId, setEditingColmenaId] = useState<number | null>(null);
  const [expandedColmenaId, setExpandedColmenaId] = useState<number | null>(
    null,
  );
  const [modalColmenaId, setModalColmenaId] = useState<number | null>(null);

  // Form states para crear/editar colmena
  const [codigoColmena, setCodigoColmena] = useState('');
  const [estadoGeneral, setEstadoGeneral] = useState('');
  const [fechaInstalacion, setFechaInstalacion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [fotoColmena, setFotoColmena] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const idNum =
        typeof id === 'string'
          ? parseInt(id)
          : Array.isArray(id)
            ? parseInt(id[0])
            : 0;
      const apiarioData = await apiarioService.getApiarioById(idNum);
      if (apiarioData) {
        setApiario(apiarioData);
        const colmenasData = await colmenaService.getColmenasByApiario(idNum);
        // attach last inspection info
        const withIns = await Promise.all(
          colmenasData.map(async (c) => {
            try {
              const last = await inspeccionService.getLastInspeccionByColmena(
                c.id_colmena,
              );
              return {
                ...c,
                ultima_inspeccion_fecha: last?.fecha_inspeccion,
                ultima_inspeccion_estado: last?.estado_colmena,
              };
            } catch (e) {
              console.error('error fetching last insp for colmena', e);
              return c;
            }
          }),
        );
        setColmenas(withIns);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el apiario');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetColmenaForm = () => {
    setCodigoColmena('');
    setEstadoGeneral('');
    setFechaInstalacion('');
    setObservaciones('');
    setFotoColmena('');
    setEditingColmenaId(null);
  };

  const handleOpenNewColmena = () => {
    resetColmenaForm();
    setShowNewColmenaModal(true);
  };

  const handleSaveColmena = async () => {
    if (!codigoColmena.trim() || !fechaInstalacion.trim()) {
      Alert.alert('Error', 'Código y fecha de instalación son requeridos');
      return;
    }

    try {
      const idNum =
        typeof id === 'string'
          ? parseInt(id)
          : Array.isArray(id)
            ? parseInt(id[0])
            : 0;
      const colmenaData = {
        codigo_colmena: codigoColmena.trim(),
        estado_general: estadoGeneral.trim() || undefined,
        fecha_instalacion: fechaInstalacion,
        observaciones: observaciones.trim() || undefined,
        foto_url: fotoColmena || undefined,
        id_apiario: idNum,
      };

      if (editingColmenaId) {
        await colmenaService.updateColmena(editingColmenaId, colmenaData);
        Alert.alert('Éxito', 'Colmena actualizada correctamente');
      } else {
        await colmenaService.createColmena(colmenaData as any);
        Alert.alert('Éxito', 'Colmena creada correctamente');
      }

      setShowNewColmenaModal(false);
      resetColmenaForm();
      await loadData();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la colmena');
      console.error(error);
    }
  };

  const handleEditColmena = (colmena: Colmena) => {
    setCodigoColmena(colmena.codigo_colmena);
    setEstadoGeneral(colmena.estado_general || '');
    setFechaInstalacion(colmena.fecha_instalacion);
    setObservaciones(colmena.observaciones || '');
    setFotoColmena(colmena.foto_url || '');
    setEditingColmenaId(colmena.id_colmena);
    setShowNewColmenaModal(true);
  };

  const handleDeleteColmena = (id: number, codigo: string) => {
    Alert.alert(
      'Confirmar eliminar',
      `¿Estás seguro de que quieres eliminar la colmena "${codigo}"?`,
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await colmenaService.deleteColmena(id);
              await loadData();
              Alert.alert('Éxito', 'Colmena eliminada correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la colmena');
              console.error(error);
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  const renderColmenaItem = ({ item }: { item: Colmena }) => (
    <TouchableOpacity
      style={styles.colmenaCard}
      activeOpacity={0.7}
      onPress={() =>
        setExpandedColmenaId((prev) =>
          prev === item.id_colmena ? null : item.id_colmena,
        )
      }
    >
      {item.foto_url && (
        <Image source={{ uri: item.foto_url }} style={styles.colmenaImage} />
      )}

      <View style={styles.colmenaHeader}>
        <View style={styles.colmenaInfo}>
          <Text style={styles.colmenaCodigo}>{item.codigo_colmena}</Text>
          <Text style={styles.colmenaDate}>
            Instalación: {new Date(item.fecha_instalacion).toLocaleDateString()}
          </Text>
          {item.ultima_inspeccion_fecha && (
            <Text style={styles.lastInspection}>
              Últ. insp.:{' '}
              {new Date(item.ultima_inspeccion_fecha).toLocaleDateString()}{' '}
              {item.ultima_inspeccion_estado
                ? `(${item.ultima_inspeccion_estado})`
                : ''}
            </Text>
          )}
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditColmena(item)}
          >
            <Edit2 size={16} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              handleDeleteColmena(item.id_colmena, item.codigo_colmena)
            }
          >
            <Trash2 size={16} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {item.estado_general && (
        <View style={styles.estadoBadge}>
          <Text style={styles.estadoText}>{item.estado_general}</Text>
        </View>
      )}

      {item.observaciones && (
        <Text
          style={styles.colmenaObservaciones}
          numberOfLines={expandedColmenaId === item.id_colmena ? undefined : 2}
        >
          {item.observaciones}
        </Text>
      )}
      {expandedColmenaId === item.id_colmena && (
        <ColmenaInlineDetail colmenaId={item.id_colmena} />
      )}
    </TouchableOpacity>
  );

  function ColmenaInlineDetail({ colmenaId }: { colmenaId: number }) {
    return (
      <View
        style={{
          padding: theme.spacing.md,
          backgroundColor: theme.colors.white,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity onPress={() => setModalColmenaId(colmenaId)}>
            <Text style={{ color: theme.colors.primary, fontSize: 12 }}>
              Detalle
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
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

  if (!apiario) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
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
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {apiario.nombre}
        </Text>
        <TouchableOpacity
          onPress={() =>
            router.push(`/apiarios/edit/${apiario.id_apiario}` as any)
          }
          style={styles.editHeaderButton}
        >
          <Edit2 size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Foto del Apiario */}
        {apiario.foto_url && (
          <Image
            source={{ uri: apiario.foto_url }}
            style={styles.apiarioImage}
          />
        )}

        {/* Info del Apiario */}
        <View style={styles.apiarioInfoCard}>
          {apiario.descripcion && (
            <Text style={styles.apiarioDescription}>{apiario.descripcion}</Text>
          )}

          <View style={styles.infoRow}>
            {apiario.municipio && (
              <>
                <MapPin size={16} color={theme.colors.primary} />
                <Text style={styles.infoText}>{apiario.municipio}</Text>
              </>
            )}
          </View>

          <View style={styles.infoRow}>
            <Calendar size={16} color={theme.colors.darkGray} />
            <Text style={styles.infoText}>
              Creado: {new Date(apiario.fecha_creacion).toLocaleDateString()}
            </Text>
          </View>

          {apiario.latitud && apiario.longitud && (
            <View style={styles.coordsContainer}>
              <Text style={styles.coordsLabel}>Coordenadas:</Text>
              <Text style={styles.coordsText}>
                {apiario.latitud.toFixed(4)}, {apiario.longitud.toFixed(4)}
              </Text>
            </View>
          )}
        </View>

        {/* Colmenas Section */}
        <View style={styles.colmenasSection}>
          <View style={styles.colmenasSectionHeader}>
            <Text style={styles.colmenasSectionTitle}>
              Colmenas ({colmenas.length})
            </Text>
            <TouchableOpacity
              style={styles.addColmenaButton}
              onPress={handleOpenNewColmena}
            >
              <Plus size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {colmenas.length === 0 ? (
            <View style={styles.emptyColmenas}>
              <Text style={styles.emptyText}>
                No hay colmenas en este apiario
              </Text>
              <Text style={styles.emptySubtext}>
                Toca el botón + para agregar una
              </Text>
            </View>
          ) : (
            <FlatList
              data={colmenas}
              renderItem={renderColmenaItem}
              keyExtractor={(item) => item.id_colmena.toString()}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      </ScrollView>

      {/* Modal para crear/editar colmena */}
      <Modal
        visible={showNewColmenaModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNewColmenaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingColmenaId ? 'Editar Colmena' : 'Nueva Colmena'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowNewColmenaModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalForm}
              showsVerticalScrollIndicator={false}
            >
              <PhotoPicker
                photoUri={fotoColmena}
                onPhotoSelected={setFotoColmena}
                onPhotoRemoved={() => setFotoColmena('')}
                label="Foto de la Colmena"
              />

              <View style={styles.formGroup}>
                <Text style={styles.label}>Código *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: C-001"
                  value={codigoColmena}
                  onChangeText={setCodigoColmena}
                  placeholderTextColor={theme.colors.mediumGray}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Estado General</Text>
                <StatePickerField
                  label=""
                  value={estadoGeneral}
                  onStateChange={setEstadoGeneral}
                />
              </View>

              <DatePickerField
                label="Fecha de Instalación *"
                value={fechaInstalacion}
                onDateChange={setFechaInstalacion}
              />

              <View style={styles.formGroup}>
                <Text style={styles.label}>Observaciones</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Notas sobre la colmena"
                  value={observaciones}
                  onChangeText={setObservaciones}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor={theme.colors.mediumGray}
                />
              </View>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setShowNewColmenaModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSaveColmena}
                >
                  <Text style={styles.saveButtonText}>
                    {editingColmenaId ? 'Guardar' : 'Crear'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* modal detalle de colmena */}
      <Modal visible={modalColmenaId !== null} animationType="slide">
        {modalColmenaId !== null && (
          <ColmenaDetail
            colmenaId={modalColmenaId}
            onClose={() => setModalColmenaId(null)}
          />
        )}
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
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.black,
    marginLeft: theme.spacing.sm,
  },
  editHeaderButton: {
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  apiarioImage: {
    width: '100%',
    height: 220,
    backgroundColor: theme.colors.lightGray,
  },
  apiarioInfoCard: {
    backgroundColor: theme.colors.lightGray,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  apiarioDescription: {
    fontSize: 14,
    color: theme.colors.black,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  infoText: {
    fontSize: 13,
    color: theme.colors.darkGray,
  },
  coordsContainer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.mediumGray,
  },
  coordsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.darkGray,
    marginBottom: theme.spacing.xs,
  },
  coordsText: {
    fontSize: 13,
    color: theme.colors.black,
    fontFamily: 'monospace',
  },
  colmenasSection: {
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  colmenasSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.mediumGray,
  },
  colmenasSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.black,
  },
  addColmenaButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyColmenas: {
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.darkGray,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: 12,
    color: theme.colors.mediumGray,
  },
  colmenaCard: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  colmenaImage: {
    width: '100%',
    height: 150,
    backgroundColor: theme.colors.mediumGray,
  },
  colmenaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
  },
  colmenaInfo: {
    flex: 1,
  },
  colmenaCodigo: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  colmenaDate: {
    fontSize: 12,
    color: theme.colors.darkGray,
  },
  lastInspection: {
    fontSize: 12,
    color: theme.colors.darkGray,
    marginTop: theme.spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  editButton: {
    padding: theme.spacing.sm,
  },
  deleteButton: {
    padding: theme.spacing.sm,
  },
  estadoBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  estadoText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.white,
  },
  colmenaObservaciones: {
    fontSize: 12,
    color: theme.colors.darkGray,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    lineHeight: 16,
  },
  separator: {
    height: theme.spacing.md,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.mediumGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.black,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: theme.colors.darkGray,
  },
  modalForm: {
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
  modalButtonContainer: {
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
    borderRadius: 8,
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.lightGray,
  },
});
