import { Colmena } from '@/types/apiario';
import { getDatabase } from './database';

const db = getDatabase();

export const colmenaService = {
  // Crear colmena
  async createColmena(colmena: Omit<Colmena, 'id_colmena'>): Promise<number> {
    try {
      const result = await db.runAsync(
        `INSERT INTO colmenas (codigo_colmena, estado_general, fecha_instalacion, observaciones, id_apiario)
         VALUES (?, ?, ?, ?, ?)`,
        [
          colmena.codigo_colmena,
          colmena.estado_general || null,
          colmena.fecha_instalacion,
          colmena.observaciones || null,
          colmena.id_apiario,
        ]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error creating colmena:', error);
      throw error;
    }
  },

  // Obtener todas las colmenas de un apiario
  async getColmenasByApiario(id_apiario: number): Promise<Colmena[]> {
    try {
      const result = await db.getAllAsync<Colmena>(
        'SELECT * FROM colmenas WHERE id_apiario = ? ORDER BY fecha_instalacion DESC',
        [id_apiario]
      );
      return result;
    } catch (error) {
      console.error('Error fetching colmenas:', error);
      throw error;
    }
  },

  // Obtener colmena por ID
  async getColmenaById(id: number): Promise<Colmena | null> {
    try {
      const result = await db.getFirstAsync<Colmena>(
        'SELECT * FROM colmenas WHERE id_colmena = ?',
        [id]
      );
      return result || null;
    } catch (error) {
      console.error('Error fetching colmena:', error);
      throw error;
    }
  },

  // Actualizar colmena
  async updateColmena(id: number, colmena: Partial<Colmena>): Promise<void> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (colmena.codigo_colmena !== undefined) {
        updates.push('codigo_colmena = ?');
        values.push(colmena.codigo_colmena);
      }
      if (colmena.estado_general !== undefined) {
        updates.push('estado_general = ?');
        values.push(colmena.estado_general);
      }
      if (colmena.fecha_instalacion !== undefined) {
        updates.push('fecha_instalacion = ?');
        values.push(colmena.fecha_instalacion);
      }
      if (colmena.observaciones !== undefined) {
        updates.push('observaciones = ?');
        values.push(colmena.observaciones);
      }

      if (updates.length === 0) return;

      values.push(id);
      const query = `UPDATE colmenas SET ${updates.join(', ')} WHERE id_colmena = ?`;
      await db.runAsync(query, values);
    } catch (error) {
      console.error('Error updating colmena:', error);
      throw error;
    }
  },

  // Eliminar colmena
  async deleteColmena(id: number): Promise<void> {
    try {
      await db.runAsync('DELETE FROM colmenas WHERE id_colmena = ?', [id]);
    } catch (error) {
      console.error('Error deleting colmena:', error);
      throw error;
    }
  },
};
