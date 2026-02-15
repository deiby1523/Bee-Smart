import { Apiario } from '@/types/apiario';
import { getDatabase } from './database';

const db = getDatabase();

export const apiarioService = {
  // Crear apiario
  async createApiario(apiario: Omit<Apiario, 'id_apiario'>): Promise<number> {
    try {
      const result = await db.runAsync(
        `INSERT INTO apiarios (nombre, descripcion, latitud, longitud, municipio, fecha_creacion, id_usuario)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          apiario.nombre,
          apiario.descripcion || null,
          apiario.latitud || null,
          apiario.longitud || null,
          apiario.municipio || null,
          apiario.fecha_creacion,
          apiario.id_usuario || null,
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

  // Obtener municipios únicos
  async getUniqueMunicipios(): Promise<string[]> {
    try {
      const result = await db.getAllAsync<{ municipio: string }>(
        'SELECT DISTINCT municipio FROM apiarios WHERE municipio IS NOT NULL AND municipio != "" ORDER BY municipio ASC'
      );
      return result.map(r => r.municipio).filter(m => m && m.trim() !== '');
    } catch (error) {
      console.error('Error fetching unique municipios:', error);
      return [];
    }
  },
};
