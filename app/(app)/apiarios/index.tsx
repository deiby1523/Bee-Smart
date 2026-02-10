import { theme } from '@/constants/theme';
import { apiarioService } from '@/src/services/apiarioService';
import { initDatabase } from '@/src/services/database';
import { Apiario } from '@/types/apiario';
import { useRouter } from 'expo-router';
import { Edit2, Plus, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function ApiariosList() {
  const router = useRouter();
  const [apiarios, setApiarios] = useState<Apiario[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const setupAndLoad = async () => {
      try {
        await initDatabase();
        await loadApiarios();
      } catch (error) {
        Alert.alert('Error', 'No se pudo inicializar la base de datos');
        console.error(error);
      }
    };
    setupAndLoad();
  }, []);

  const loadApiarios = async () => {
    try {
      const data = await apiarioService.getAllApiarios();
      setApiarios(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los apiarios');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadApiarios();
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
              await loadApiarios();
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

  const renderApiarioItem = ({ item }: { item: Apiario }) => (
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
      {item.municipio && (
        <Text style={styles.cardMunicipio}>{item.municipio}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Apiarios</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/apiarios/new' as any)}
        >
          <Plus size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      {loading && apiarios.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>Cargando...</Text>
        </View>
      ) : apiarios.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No hay apiarios aún</Text>
          <Text style={styles.emptySubtext}>
            Toca el botón + para crear uno
          </Text>
        </View>
      ) : (
        <FlatList
          data={apiarios}
          renderItem={renderApiarioItem}
          keyExtractor={(item) => item.id_apiario.toString()}
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
    marginTop: theme.spacing.sm,
  },
  cardMunicipio: {
    fontSize: 13,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
    fontWeight: '500',
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
