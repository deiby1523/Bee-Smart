import DatePickerField from '@/components/DatePickerField';
import Header from '@/components/Header';
import SearchFilter from '@/components/SearchFilter';
import StatePickerField from '@/components/StatePickerField';
import { theme } from '@/constants/theme';
import { apiarioService } from '@/src/services/apiarioService';
import { colmenaService } from '@/src/services/colmenaService';
import { initDatabase } from '@/src/services/database';
import { inspeccionService } from '@/src/services/inspeccionService';
import { produccionService } from '@/src/services/produccionService';
import { productoService } from '@/src/services/productoService';
import { Apiario, Colmena } from '@/types/apiario';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useRouter } from 'expo-router';
import { Hexagon, Plus } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ColmenaWithApiario extends Colmena {
  apiarioNombre?: string;
  ultima_inspeccion_fecha?: string;
  ultima_inspeccion_estado?: string;
}

interface InspeccionLocal {
  id_inspeccion: number;
  fecha_inspeccion: string;
  estado_colmena?: string;
  observaciones?: string;
  id_colmena: number;
}

interface ProduccionWithExtrasLocal {
  id_produccion: number;
  fecha_cosecha: string;
  cantidad: number;
  observaciones?: string;
  id_colmena: number;
  id_apiario: number;
  id_producto: number;
  productoNombre?: string;
}

export default function ColmenasScreen() {
  const router = useRouter();
  const [colmenas, setColmenas] = useState<ColmenaWithApiario[]>([]);
  const [apiarios, setApiarios] = useState<Apiario[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [expandedColmenaId, setExpandedColmenaId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const setupAndLoad = async () => {
      try {
        await initDatabase();
        await loadData();
      } catch (error) {
        Alert.alert('Error', 'No se pudo inicializar la base de datos');
        console.error(error);
      }
    };
    setupAndLoad();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, []),
  );

  const loadData = async () => {
    try {
      // Cargar apiarios
      const apiariosData = await apiarioService.getAllApiarios();
      setApiarios(apiariosData);

      // Cargar colmenas de todos los apiarios
      const allColmenas: ColmenaWithApiario[] = [];
      for (const apiario of apiariosData) {
        const colmenasDelApiario = await colmenaService.getColmenasByApiario(
          apiario.id_apiario,
        );
        const colmenasConApiario = colmenasDelApiario.map((col) => ({
          ...col,
          apiarioNombre: apiario.nombre,
        }));
        allColmenas.push(...colmenasConApiario);
      }

      // agregar datos de última inspección para cada colmena
      const augmented = await Promise.all(
        allColmenas.map(async (col) => {
          try {
            const last = await inspeccionService.getLastInspeccionByColmena(
              col.id_colmena,
            );
            return {
              ...col,
              ultima_inspeccion_fecha: last?.fecha_inspeccion,
              ultima_inspeccion_estado: last?.estado_colmena,
            };
          } catch (e) {
            console.error('Error cargando última inspección', e);
            return col;
          }
        }),
      );
      setColmenas(augmented);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las colmenas');
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

  // Filtrar y buscar colmenas
  const filteredColmenas = useMemo(() => {
    let result = [...colmenas];

    // Filtrar por estado
    if (activeFilter) {
      result = result.filter((c) => c.estado_general === activeFilter);
    }

    // Buscar por código, apiario u observaciones
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.codigo_colmena.toLowerCase().includes(query) ||
          (c.apiarioNombre?.toLowerCase().includes(query) ?? false) ||
          (c.observaciones?.toLowerCase().includes(query) ?? false),
      );
    }

    return result;
  }, [colmenas, activeFilter, searchQuery]);

  // Obtener estados únicos de colmenas
  const estadosUnicos = useMemo(() => {
    const estados = new Set(
      colmenas.filter((c) => c.estado_general).map((c) => c.estado_general!),
    );
    return Array.from(estados).sort();
  }, [colmenas]);

  const estadoFilters = estadosUnicos.map((e) => ({
    id: e,
    label: e,
  }));

  const renderColmenaItem = ({ item }: { item: ColmenaWithApiario }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        setExpandedColmenaId((prev) =>
          prev === item.id_colmena ? null : item.id_colmena,
        )
      }
      activeOpacity={0.7}
    >
      {item.foto_url && (
        <Image source={{ uri: item.foto_url }} style={styles.cardImage} />
      )}
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
          <Text style={styles.colmenaCodigo}>{item.codigo_colmena}</Text>
          <Text style={styles.apiarioNombre}>{item.apiarioNombre}</Text>
          <Text style={styles.cardDate}>
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
        <View style={styles.rightContent}>
          {item.estado_general && (
            <View style={styles.estadoBadge}>
              <Text style={styles.estadoText}>{item.estado_general}</Text>
            </View>
          )}
        </View>
      </View>
      {item.observaciones && (
        <Text
          style={styles.observaciones}
          numberOfLines={expandedColmenaId === item.id_colmena ? undefined : 2}
        >
          {item.observaciones}
        </Text>
      )}
      {expandedColmenaId === item.id_colmena && (
        <ColmenaInlineDetail
          colmenaId={item.id_colmena}
          apiarioId={item.id_apiario}
        />
      )}
    </TouchableOpacity>
  );

  function ColmenaInlineDetail({
    colmenaId,
    apiarioId,
  }: {
    colmenaId: number;
    apiarioId: number;
  }) {
    const [inspecciones, setInspecciones] = useState<InspeccionLocal[]>([]);
    const [producciones, setProducciones] = useState<
      ProduccionWithExtrasLocal[]
    >([]);
    const [productos, setProductos] = useState<any[]>([]);

    const [showNewInsForm, setShowNewInsForm] = useState(false);
    const [insFecha, setInsFecha] = useState('');
    const [insEstado, setInsEstado] = useState('');
    const [insObs, setInsObs] = useState('');

    const [showNewProdForm, setShowNewProdForm] = useState(false);
    const [prodFecha, setProdFecha] = useState('');
    const [prodCantidad, setProdCantidad] = useState('');
    const [prodProducto, setProdProducto] = useState<number | null>(null);

    useEffect(() => {
      loadInline();
    }, []);

    const loadInline = async () => {
      try {
        const ins = await inspeccionService.getInspeccionesByColmena(colmenaId);
        setInspecciones(ins);
        const prods = await produccionService.getProduccionByColmena(colmenaId);
        const prodList = await productoService.getAllProductos();
        setProductos(prodList);
        const prodsAug = prods.map((p: any) => ({
          ...p,
          productoNombre: prodList.find(
            (x: any) => x.id_producto === p.id_producto,
          )?.nombre,
        }));
        setProducciones(prodsAug);
      } catch (e) {
        console.error('inline load error', e);
      }
    };

    const saveIns = async () => {
      if (!insFecha) {
        Alert.alert('Fecha requerida');
        return;
      }
      try {
        await inspeccionService.createInspeccion({
          fecha_inspeccion: insFecha,
          estado_colmena: insEstado || undefined,
          observaciones: insObs || undefined,
          id_colmena: colmenaId,
        } as any);
        setShowNewInsForm(false);
        setInsFecha('');
        setInsEstado('');
        setInsObs('');
        await loadInline();
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'No se pudo crear inspección');
      }
    };

    const saveProd = async () => {
      if (!prodFecha || !prodCantidad || !prodProducto) {
        Alert.alert('Datos incompletos');
        return;
      }
      try {
        await produccionService.createProduccion({
          fecha_cosecha: prodFecha,
          cantidad: parseFloat(prodCantidad),
          id_colmena: colmenaId,
          id_apiario: apiarioId,
          id_producto: prodProducto,
        } as any);
        setShowNewProdForm(false);
        setProdFecha('');
        setProdCantidad('');
        setProdProducto(null);
        await loadInline();
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'No se pudo crear producción');
      }
    };

    return (
      <View style={{ padding: 12, backgroundColor: '#f7f7f7' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontWeight: '700' }}>
            Inspecciones ({inspecciones.length})
          </Text>
          <TouchableOpacity
            onPress={() => setShowNewInsForm((s) => !s)}
            style={{ padding: 6 }}
          >
            <Plus size={14} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        {showNewInsForm && (
          <View style={{ marginTop: 8 }}>
            <DatePickerField
              label="Fecha"
              value={insFecha}
              onDateChange={setInsFecha}
            />
            <StatePickerField
              label="Estado"
              value={insEstado}
              onStateChange={setInsEstado}
            />
            <TextInput
              style={styles.input}
              placeholder="Observaciones"
              value={insObs}
              onChangeText={setInsObs}
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.saveButton} onPress={saveIns}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowNewInsForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {inspecciones.map((it) => (
          <View
            key={it.id_inspeccion}
            style={{
              marginTop: 8,
              padding: 8,
              backgroundColor: 'white',
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 12 }}>
              {new Date(it.fecha_inspeccion).toLocaleDateString()}{' '}
              {it.estado_colmena ? `- ${it.estado_colmena}` : ''}
            </Text>
            {it.observaciones ? (
              <Text style={{ fontSize: 12, color: theme.colors.darkGray }}>
                {it.observaciones}
              </Text>
            ) : null}
          </View>
        ))}

        <View style={{ height: 12 }} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontWeight: '700' }}>
            Producción ({producciones.length})
          </Text>
          <TouchableOpacity
            onPress={() => setShowNewProdForm((s) => !s)}
            style={{ padding: 6 }}
          >
            <Plus size={14} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {showNewProdForm && (
          <View style={{ marginTop: 8 }}>
            <DatePickerField
              label="Fecha"
              value={prodFecha}
              onDateChange={setProdFecha}
            />
            <TextInput
              style={styles.input}
              placeholder="Cantidad"
              value={prodCantidad}
              onChangeText={setProdCantidad}
              keyboardType="numeric"
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={prodProducto}
                onValueChange={(v) => setProdProducto(v)}
              >
                <Picker.Item label="Seleccionar..." value={null} />
                {productos.map((pr: any) => (
                  <Picker.Item
                    key={pr.id_producto}
                    label={pr.nombre}
                    value={pr.id_producto}
                  />
                ))}
              </Picker>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.saveButton} onPress={saveProd}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowNewProdForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {producciones.map((p) => (
          <View
            key={p.id_produccion}
            style={{
              marginTop: 8,
              padding: 8,
              backgroundColor: 'white',
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 12 }}>
              {new Date(p.fecha_cosecha).toLocaleDateString()} - {p.cantidad}{' '}
              {p.productoNombre ? `(${p.productoNombre})` : ''}
            </Text>
            {p.observaciones ? (
              <Text style={{ fontSize: 12, color: theme.colors.darkGray }}>
                {p.observaciones}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Colmenas</Text>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.push('/apiarios' as any)}
        >
          <Text style={styles.linkButtonText}>Ver Apiarios</Text>
        </TouchableOpacity>
      </View>

      {loading && colmenas.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>Cargando...</Text>
        </View>
      ) : colmenas.length === 0 ? (
        <View style={styles.centerContent}>
          <Hexagon size={48} color={theme.colors.mediumGray} />
          <Text style={styles.emptyText}>No hay colmenas aún</Text>
          <Text style={styles.emptySubtext}>
            Crea un apiario y agrega colmenas desde la pestaña "Apiarios"
          </Text>
        </View>
      ) : (
        <>
          {colmenas.length > 0 && (
            <SearchFilter
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              onClearSearch={() => setSearchQuery('')}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              filters={estadoFilters}
              placeholder="Buscar colmena..."
            />
          )}

          {filteredColmenas.length === 0 ? (
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>No se encontraron colmenas</Text>
              <Text style={styles.emptySubtext}>
                Intenta con otro búsqueda o filtro
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredColmenas}
              renderItem={renderColmenaItem}
              keyExtractor={(item) => `${item.id_apiario}-${item.id_colmena}`}
              contentContainerStyle={styles.listContent}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              scrollEnabled={true}
              ListHeaderComponent={
                searchQuery ||
                activeFilter ||
                filteredColmenas.length !== colmenas.length ? (
                  <View style={styles.resultCountContainer}>
                    <Hexagon size={16} color={theme.colors.primary} />
                    <Text style={styles.resultCount}>
                      {filteredColmenas.length} de {colmenas.length} colmenas
                    </Text>
                  </View>
                ) : null
              }
            />
          )}
        </>
      )}
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
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.mediumGray,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  linkButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
  },
  linkButtonText: {
    color: theme.colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  resultCount: {
    fontSize: 12,
    color: theme.colors.darkGray,
    fontWeight: '500',
    marginBottom: theme.spacing.md,
  },
  resultCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
  },
  cardImage: {
    width: '100%',
    height: 140,
    backgroundColor: theme.colors.mediumGray,
  },
  lastInspection: {
    fontSize: 12,
    color: theme.colors.darkGray,
    marginTop: theme.spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  colmenaCodigo: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  apiarioNombre: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  cardDate: {
    fontSize: 11,
    color: theme.colors.darkGray,
  },
  rightContent: {
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
  estadoBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  estadoText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.white,
  },
  observaciones: {
    fontSize: 12,
    color: theme.colors.darkGray,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    lineHeight: 16,
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
    marginRight: theme.spacing.sm,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.mediumGray,
    borderRadius: 8,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.lightGray,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.darkGray,
    textAlign: 'center',
  },
});
