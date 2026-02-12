import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('bee-smart.db');

export async function initDatabase() {
  try {
    // Crear tabla apiarios
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS apiarios (
        id_apiario INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        latitud REAL,
        longitud REAL,
        municipio TEXT,
        fecha_creacion TEXT NOT NULL,
        id_usuario INTEGER,
        foto_url TEXT
      );
    `);

    // Crear tabla colmenas
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS colmenas (
        id_colmena INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo_colmena TEXT NOT NULL,
        estado_general TEXT,
        fecha_instalacion TEXT NOT NULL,
        observaciones TEXT,
        id_apiario INTEGER NOT NULL,
        foto_url TEXT,
        FOREIGN KEY (id_apiario) REFERENCES apiarios(id_apiario) ON DELETE CASCADE
      );
    `);

    // Adicionar columna foto_url si no existe (para migraciones)
    try {
      await db.execAsync(`ALTER TABLE apiarios ADD COLUMN foto_url TEXT;`);
    } catch (e) {
      // La columna ya existe, ignorar el error
    }

    try {
      await db.execAsync(`ALTER TABLE colmenas ADD COLUMN foto_url TEXT;`);
    } catch (e) {
      // La columna ya existe, ignorar el error
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export function getDatabase() {
  return db;
}
