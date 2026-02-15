import ApiarioStatsCard from '@/components/ApiarioStatsCard';
import SearchFilter from '@/components/SearchFilter';
import { theme } from '@/constants/theme';
import { apiarioService } from '@/src/services/apiarioService';
import { colmenaService } from '@/src/services/colmenaService';
import { initDatabase } from '@/src/services/database';
import { Apiario } from '@/types/apiario';
import { useFocusEffect, useRouter } from 'expo-router';
import { Edit2, Plus, Trash2 } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ApiarioWithStats extends Apiario {
  totalColmenas: number;
  colmenasActivas: number;
}

export default function ApiariosList() {
  const router = useRouter();
  const [apiarios, setApiarios] = useState<ApiarioWithStats[]>([]);
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMunicipio, setActiveMunicipio] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    }, [])
  );

  const loadData = async () => {
    try {
      // Cargar apiarios con estadísticas
      const allApiarios = await apiarioService.getAllApiarios();
      
      const apiariosWithStats: ApiarioWithStats[] = [];
      for (const apiario of allApiarios) {
        const colmenas = await colmenaService.getColmenasByApiario(
          apiario.id_apiario
        );
        const colmenasActivas = colmenas.filter(
          (c) => c.estado_general === 'Activo' || c.estado_general === 'Fuerte'
        ).length;

        apiariosWithStats.push({
          ...apiario,
          totalColmenas: colmenas.length,
          colmenasActivas,
        });
      }

      setApiarios(apiariosWithStats);

      // Cargar municipios únicos
      const muns = await apiarioService.getUniqueMunicipios();
      setMunicipios(muns);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
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

  const handleDelete = (id: number, nombre: string) => {
    Alert.alert(
      'Confirmar eliminar',
      `¿Estás seguro de que quieres eliminar "${nombre}"? Se eliminarán todas sus colmenas.`,
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await apiarioService.deleteApiario(id);
              await loadData();
              Alert.alert('Éxito', 'Apiario eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el apiario');
              console.error(error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Filtrar y buscar apiarios
  const filteredApiarios = useMemo(() => {
    let result = [...apiarios];

    // Filtrar por municipio
    if (activeMunicipio) {
      result = result.filter((a) => a.municipio === activeMunicipio);
    }

    // Buscar por nombre, descripción o municipio
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.nombre.toLowerCase().includes(query) ||
          (a.descripcion?.toLowerCase().includes(query) ?? false) ||
          (a.municipio?.toLowerCase().includes(query) ?? false)
      );
    }

    return result;
  }, [apiarios, activeMunicipio, searchQuery]);

  const municipioFilters = municipios.map((m) => ({
    id: m,
    label: m,
  }));

  const renderApiarioItem = ({ item }: { item: ApiarioWithStats }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/apiarios/${item.id_apiario}` as any)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.nombre}</Text>
          <Text style={styles.cardDate}>
            {new Date(item.fecha_creacion).toLocaleDateString()}
          </Text>
          {item.municipio && (
            <Text style={styles.cardMunicipio}>{item.municipio}</Text>
          )}
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push(`/apiarios/edit/${item.id_apiario}` as any)}
          >
            <Edit2 size={18} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id_apiario, item.nombre)}
          >
            <Trash2 size={18} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {item.descripcion && (
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.descripcion}
        </Text>
      )}

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <ApiarioStatsCard
          totalColmenas={item.totalColmenas}
          colmenasActivas={item.colmenasActivas}
          showDetails={true}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Apiarios</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/apiarios/new' as any)}
        >
          <Plus size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      {!loading && apiarios.length > 0 && (
        <SearchFilter
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery('')}
          activeFilter={activeMunicipio}
          onFilterChange={setActiveMunicipio}
          filters={municipioFilters}
          placeholder="Buscar apiario..."
        />
      )}

      {loading && apiarios.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>Cargando...</Text>
        </View>
      ) : filteredApiarios.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>
            {apiarios.length === 0
              ? 'No hay apiarios aún'
              : 'No se encontraron resultados'}
          </Text>
          <Text style={styles.emptySubtext}>
            {apiarios.length === 0
              ? 'Toca el botón + para crear uno'
              : 'Intenta con otra búsqueda o filtro'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredApiarios}
          renderItem={renderApiarioItem}
          keyExtractor={(item) => item.id_apiario.toString()}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          scrollEnabled={true}
          ListHeaderComponent={
            searchQuery || activeMunicipio || filteredApiarios.length !== apiarios.length
              ? (
                  <Text style={styles.resultCount}>
                    {filteredApiarios.length} de {apiarios.length} apiarios
                  </Text>
                )
              : null
          }
        />
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
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
  card: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  cardDate: {
    fontSize: 12,
    color: theme.colors.darkGray,
  },
  cardMunicipio: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
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
  cardDescription: {
    fontSize: 14,
    color: theme.colors.darkGray,
    marginBottom: theme.spacing.md,
  },
  statsContainer: {
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.mediumGray,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.darkGray,
  },
});
