import { theme } from '@/constants/theme';
import { apiarioService } from '@/src/services/apiarioService';
import { colmenaService } from '@/src/services/colmenaService';
import { initDatabase } from '@/src/services/database';
import { Apiario, Colmena } from '@/types/apiario';
import { useFocusEffect, useRouter } from 'expo-router';
import { AlertCircle, ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ColmenaWithApiario extends Colmena {
  apiarioNombre?: string;
}

export default function ColmenasScreen() {
  const router = useRouter();
  const [colmenas, setColmenas] = useState<ColmenaWithApiario[]>([]);
  const [apiarios, setApiarios] = useState<Apiario[]>([]);
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

  const renderColmenaItem = ({ item }: { item: ColmenaWithApiario }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/apiarios/${item.id_apiario}` as any)}
      activeOpacity={0.7}
    >
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
    <View style={styles.container}>
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
        <FlatList
          data={colmenas}
          renderItem={renderColmenaItem}
          keyExtractor={(item) => `${item.id_apiario}-${item.id_colmena}`}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          scrollEnabled={true}
        />
      )}
    </View>
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
    alignItems: 'flex-start',
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
    marginTop: theme.spacing.sm,
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

