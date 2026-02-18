import { Inspeccion } from '@/types/apiario';
import { getDatabase } from './database';

const db = getDatabase();

export const inspeccionService = {
  async createInspeccion(ins: Omit<Inspeccion, 'id_inspeccion'>): Promise<number> {
    try {
      const result = await db.runAsync(
        `INSERT INTO inspecciones (fecha_inspeccion, estado_colmena, observaciones, id_colmena)
         VALUES (?, ?, ?, ?)`,
        [
          ins.fecha_inspeccion,
          ins.estado_colmena || null,
          ins.observaciones || null,
          ins.id_colmena,
        ]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error creating inspeccion:', error);
      throw error;
    }
  },

  async getInspeccionesByColmena(id_colmena: number): Promise<Inspeccion[]> {
    try {
      const result = await db.getAllAsync<Inspeccion>(
        'SELECT * FROM inspecciones WHERE id_colmena = ? ORDER BY fecha_inspeccion DESC',
        [id_colmena]
      );
      return result;
    } catch (error) {
      console.error('Error fetching inspecciones:', error);
      throw error;
    }
  },

  async getLastInspeccionByColmena(id_colmena: number): Promise<Inspeccion | null> {
    try {
      const result = await db.getFirstAsync<Inspeccion>(
        'SELECT * FROM inspecciones WHERE id_colmena = ? ORDER BY fecha_inspeccion DESC LIMIT 1',
        [id_colmena]
      );
      return result || null;
    } catch (error) {
      console.error('Error fetching last inspeccion:', error);
      throw error;
    }
  },

  async getAllInspecciones(): Promise<Inspeccion[]> {
    try {
      const result = await db.getAllAsync<Inspeccion>(
        'SELECT * FROM inspecciones ORDER BY fecha_inspeccion DESC',
        []
      );
      return result;
    } catch (error) {
      console.error('Error fetching all inspecciones:', error);
      throw error;
    }
  },

  async getInspeccionById(id: number): Promise<Inspeccion | null> {
    try {
      const result = await db.getFirstAsync<Inspeccion>(
        'SELECT * FROM inspecciones WHERE id_inspeccion = ?',
        [id]
      );
      return result || null;
    } catch (error) {
      console.error('Error fetching inspeccion:', error);
      throw error;
    }
  },

  async updateInspeccion(id: number, ins: Partial<Inspeccion>): Promise<void> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (ins.fecha_inspeccion !== undefined) {
        updates.push('fecha_inspeccion = ?');
        values.push(ins.fecha_inspeccion);
      }
      if (ins.estado_colmena !== undefined) {
        updates.push('estado_colmena = ?');
        values.push(ins.estado_colmena);
      }
      if (ins.observaciones !== undefined) {
        updates.push('observaciones = ?');
        values.push(ins.observaciones);
      }

      if (updates.length === 0) return;
      values.push(id);
      const query = `UPDATE inspecciones SET ${updates.join(', ')} WHERE id_inspeccion = ?`;
      await db.runAsync(query, values);
    } catch (error) {
      console.error('Error updating inspeccion:', error);
      throw error;
    }
  },

  async deleteInspeccion(id: number): Promise<void> {
    try {
      await db.runAsync('DELETE FROM inspecciones WHERE id_inspeccion = ?', [id]);
    } catch (error) {
      console.error('Error deleting inspeccion:', error);
      throw error;
    }
  },
};