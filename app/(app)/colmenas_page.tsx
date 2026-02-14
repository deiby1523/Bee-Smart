import { theme } from '@/constants/theme';
import { apiarioService } from '@/src/services/apiarioService';
import { colmenaService } from '@/src/services/colmenaService';
import { initDatabase } from '@/src/services/database';
import { Apiario, Colmena } from '@/types/apiario';
import { useFocusEffect, useRouter } from 'expo-router';
import { AlertCircle, ChevronRight } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchFilter from '@/components/SearchFilter';

interface ColmenaWithApiario extends Colmena {
  apiarioNombre?: string;
}

export default function ColmenasScreen() {
  const router = useRouter();
  const [colmenas, setColmenas] = useState<ColmenaWithApiario[]>([]);
  const [apiarios, setApiarios] = useState<Apiario[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

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
      // Cargar apiarios
      const apiariosData = await apiarioService.getAllApiarios();
      setApiarios(apiariosData);

      // Cargar colmenas de todos los apiarios
      const allColmenas: ColmenaWithApiario[] = [];
      for (const apiario of apiariosData) {
        const colmenasDelApiario = await colmenaService.getColmenasByApiario(
          apiario.id_apiario
        );
        const colmenasConApiario = colmenasDelApiario.map((col) => ({
          ...col,
          apiarioNombre: apiario.nombre,
        }));
        allColmenas.push(...colmenasConApiario);
      }
      setColmenas(allColmenas);
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
          (c.observaciones?.toLowerCase().includes(query) ?? false)
      );
    }

    return result;
  }, [colmenas, activeFilter, searchQuery]);

  // Obtener estados únicos de colmenas
  const estadosUnicos = useMemo(() => {
    const estados = new Set(
      colmenas.filter((c) => c.estado_general).map((c) => c.estado_general!)
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
      onPress={() => router.push(`/apiarios/${item.id_apiario}` as any)}
      activeOpacity={0.7}
    >
      {item.foto_url && (
        <Image
          source={{ uri: item.foto_url }}
          style={styles.cardImage}
        />
      )}
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
          <Text style={styles.colmenaCodigo}>{item.codigo_colmena}</Text>
          <Text style={styles.apiarioNombre}>{item.apiarioNombre}</Text>
          <Text style={styles.cardDate}>
            {new Date(item.fecha_instalacion).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.rightContent}>
          {item.estado_general && (
            <View style={styles.estadoBadge}>
              <Text style={styles.estadoText}>{item.estado_general}</Text>
            </View>
          )}
          <ChevronRight size={20} color={theme.colors.primary} />
        </View>
      </View>
      {item.observaciones && (
        <Text style={styles.observaciones} numberOfLines={2}>
          {item.observaciones}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
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
          <AlertCircle size={48} color={theme.colors.mediumGray} />
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
                searchQuery || activeFilter || filteredColmenas.length !== colmenas.length
                  ? (
                      <Text style={styles.resultCount}>
                        {filteredColmenas.length} de {colmenas.length} colmenas
                      </Text>
                    )
                  : null
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

