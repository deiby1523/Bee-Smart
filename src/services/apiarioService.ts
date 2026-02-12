import { Apiario } from '@/types/apiario';
import { getDatabase } from './database';

const db = getDatabase();

interface ApiarioStats extends Apiario {
  totalColmenas: number;
  colmenasActivas: number;
}

export const apiarioService = {
  // Crear apiario
  async createApiario(apiario: Omit<Apiario, 'id_apiario'>): Promise<number> {
    try {
      const result = await db.runAsync(
        `INSERT INTO apiarios (nombre, descripcion, latitud, longitud, municipio, fecha_creacion, id_usuario, foto_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          apiario.nombre,
          apiario.descripcion || null,
          apiario.latitud || null,
          apiario.longitud || null,
          apiario.municipio || null,
          apiario.fecha_creacion,
          apiario.id_usuario || null,
          apiario.foto_url || null,
        ]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error creating apiario:', error);
      throw error;
    }
  },

  // Obtener todos los apiarios
  async getAllApiarios(): Promise<Apiario[]> {
    try {
      const result = await db.getAllAsync<Apiario>(
        'SELECT * FROM apiarios ORDER BY fecha_creacion DESC'
      );
      return result;
    } catch (error) {
      console.error('Error fetching apiarios:', error);
      throw error;
    }
  },

  // Obtener apiario por ID
  async getApiarioById(id: number): Promise<Apiario | null> {
    try {
      const result = await db.getFirstAsync<Apiario>(
        'SELECT * FROM apiarios WHERE id_apiario = ?',
        [id]
      );
      return result || null;
    } catch (error) {
      console.error('Error fetching apiario:', error);
      throw error;
    }
  },

  // Buscar apiarios por nombre
  async searchApiarios(query: string): Promise<Apiario[]> {
    try {
      const searchTerm = `%${query.toLowerCase()}%`;
      const result = await db.getAllAsync<Apiario>(
        `SELECT * FROM apiarios 
         WHERE LOWER(nombre) LIKE ? OR LOWER(descripcion) LIKE ? OR LOWER(municipio) LIKE ?
         ORDER BY fecha_creacion DESC`,
        [searchTerm, searchTerm, searchTerm]
      );
      return result;
    } catch (error) {
      console.error('Error searching apiarios:', error);
      throw error;
    }
  },

  // Filtrar apiarios por municipio
  async getApiariosByMunicipio(municipio: string): Promise<Apiario[]> {
    try {
      const result = await db.getAllAsync<Apiario>(
        'SELECT * FROM apiarios WHERE municipio = ? ORDER BY fecha_creacion DESC',
        [municipio]
      );
      return result;
    } catch (error) {
      console.error('Error filtering apiarios by municipio:', error);
      throw error;
    }
  },

  // Obtener municipios únicos
  async getUniqueMunicipios(): Promise<string[]> {
    try {
      const result = await db.getAllAsync<{ municipio: string }>(
        'SELECT DISTINCT municipio FROM apiarios WHERE municipio IS NOT NULL ORDER BY municipio'
      );
      return result.map(r => r.municipio).filter(Boolean);
    } catch (error) {
      console.error('Error fetching municipios:', error);
      throw error;
    }
  },

  // Obtener estadísticas de apiarios con colmenas
  async getApiarioWithStats(id: number): Promise<ApiarioStats | null> {
    try {
      const apiario = await db.getFirstAsync<Apiario>(
        'SELECT * FROM apiarios WHERE id_apiario = ?',
        [id]
      );
      
      if (!apiario) return null;

      const colmenasResult = await db.getFirstAsync<{ total: number; activas: number }>(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN estado_general IN ('Activo', 'Fuerte') THEN 1 ELSE 0 END) as activas
         FROM colmenas WHERE id_apiario = ?`,
        [id]
      );

      return {
        ...apiario,
        totalColmenas: colmenasResult?.total || 0,
        colmenasActivas: colmenasResult?.activas || 0,
      };
    } catch (error) {
      console.error('Error fetching apiario stats:', error);
      throw error;
    }
  },

  // Obtener todos los apiarios con estadísticas
  async getAllApiariosWithStats(): Promise<ApiarioStats[]> {
    try {
      const apiarios = await db.getAllAsync<Apiario>(
        'SELECT * FROM apiarios ORDER BY fecha_creacion DESC'
      );

      const withStats: ApiarioStats[] = [];
      for (const apiario of apiarios) {
        const colmenasResult = await db.getFirstAsync<{ total: number; activas: number }>(
          `SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN estado_general IN ('Activo', 'Fuerte') THEN 1 ELSE 0 END) as activas
           FROM colmenas WHERE id_apiario = ?`,
          [apiario.id_apiario]
        );

        withStats.push({
          ...apiario,
          totalColmenas: colmenasResult?.total || 0,
          colmenasActivas: colmenasResult?.activas || 0,
        });
      }

      return withStats;
    } catch (error) {
      console.error('Error fetching all apiarios with stats:', error);
      throw error;
    }
  },

  // Actualizar apiario
  async updateApiario(id: number, apiario: Partial<Apiario>): Promise<void> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (apiario.nombre !== undefined) {
        updates.push('nombre = ?');
        values.push(apiario.nombre);
      }
      if (apiario.descripcion !== undefined) {
        updates.push('descripcion = ?');
        values.push(apiario.descripcion);
      }
      if (apiario.latitud !== undefined) {
        updates.push('latitud = ?');
        values.push(apiario.latitud);
      }
      if (apiario.longitud !== undefined) {
        updates.push('longitud = ?');
        values.push(apiario.longitud);
      }
      if (apiario.municipio !== undefined) {
        updates.push('municipio = ?');
        values.push(apiario.municipio);
      }
      if (apiario.foto_url !== undefined) {
        updates.push('foto_url = ?');
        values.push(apiario.foto_url);
      }

      if (updates.length === 0) return;

      values.push(id);
      const query = `UPDATE apiarios SET ${updates.join(', ')} WHERE id_apiario = ?`;
      await db.runAsync(query, values);
    } catch (error) {
      console.error('Error updating apiario:', error);
      throw error;
    }
  },

  // Eliminar apiario (y sus colmenas en cascada)
  async deleteApiario(id: number): Promise<void> {
    try {
      await db.runAsync('DELETE FROM apiarios WHERE id_apiario = ?', [id]);
    } catch (error) {
      console.error('Error deleting apiario:', error);
      throw error;
    }
  },
};
