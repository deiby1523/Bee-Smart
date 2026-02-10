import { apiarioService } from '@/src/services/apiarioService';
import { colmenaService } from '@/src/services/colmenaService';
import { initDatabase } from '@/src/services/database';

// ===== EJEMPLO DE USO DE LOS SERVICIOS =====

// 1. Inicializar la base de datos (hacerlo una sola vez)
const ejemploInit = async () => {
  try {
    await initDatabase();
    console.log('BD inicializada');
  } catch (error) {
    console.error('Error inicializando BD:', error);
  }
};

// ===== OPERACIONES CON APIARIOS =====

// 2. Crear un apiario
const crearApiario = async () => {
  try {
    const id = await apiarioService.createApiario({
      nombre: 'Apiario Principal',
      descripcion: 'Mi primer apiario',
      municipio: 'Madrid',
      latitud: 40.4168,
      longitud: -3.7038,
      fecha_creacion: new Date().toISOString(),
    });
    console.log('Apiario creado con ID:', id);
  } catch (error) {
    console.error('Error creando apiario:', error);
  }
};

// 3. Obtener todos los apiarios
const obtenerTodosApiarios = async () => {
  try {
    const apiarios = await apiarioService.getAllApiarios();
    console.log('Apiarios:', apiarios);
  } catch (error) {
    console.error('Error obteniendo apiarios:', error);
  }
};

// 4. Obtener un apiario específico
const obtenerApiario = async (id: number) => {
  try {
    const apiario = await apiarioService.getApiarioById(id);
    if (apiario) {
      console.log('Apiario encontrado:', apiario);
    } else {
      console.log('Apiario no encontrado');
    }
  } catch (error) {
    console.error('Error obteniendo apiario:', error);
  }
};

// 5. Actualizar un apiario
const actualizarApiario = async (id: number) => {
  try {
    await apiarioService.updateApiario(id, {
      nombre: 'Apiario Principal (Actualizado)',
      municipio: 'Barcelona',
    });
    console.log('Apiario actualizado');
  } catch (error) {
    console.error('Error actualizando apiario:', error);
  }
};

// 6. Eliminar un apiario
const eliminarApiario = async (id: number) => {
  try {
    await apiarioService.deleteApiario(id);
    console.log('Apiario eliminado');
  } catch (error) {
    console.error('Error eliminando apiario:', error);
  }
};

// ===== OPERACIONES CON COLMENAS =====

// 7. Crear una colmena
const crearColmena = async (idApiario: number) => {
  try {
    const id = await colmenaService.createColmena({
      codigo_colmena: 'C-001',
      estado_general: 'Activo',
      fecha_instalacion: new Date().toISOString(),
      observaciones: 'Colmena principal en buen estado',
      id_apiario: idApiario,
    });
    console.log('Colmena creada con ID:', id);
  } catch (error) {
    console.error('Error creando colmena:', error);
  }
};

// 8. Obtener colmenas de un apiario
const obtenerColmenasDelApiario = async (idApiario: number) => {
  try {
    const colmenas = await colmenaService.getColmenasByApiario(idApiario);
    console.log('Colmenas del apiario:', colmenas);
  } catch (error) {
    console.error('Error obteniendo colmenas:', error);
  }
};

// 9. Obtener una colmena específica
const obtenerColmena = async (idColmena: number) => {
  try {
    const colmena = await colmenaService.getColmenaById(idColmena);
    if (colmena) {
      console.log('Colmena encontrada:', colmena);
    } else {
      console.log('Colmena no encontrada');
    }
  } catch (error) {
    console.error('Error obteniendo colmena:', error);
  }
};

// 10. Actualizar una colmena
const actualizarColmena = async (idColmena: number) => {
  try {
    await colmenaService.updateColmena(idColmena, {
      estado_general: 'Débil',
      observaciones: 'Necesita atención',
    });
    console.log('Colmena actualizada');
  } catch (error) {
    console.error('Error actualizando colmena:', error);
  }
};

// 11. Eliminar una colmena
const eliminarColmena = async (idColmena: number) => {
  try {
    await colmenaService.deleteColmena(idColmena);
    console.log('Colmena eliminada');
  } catch (error) {
    console.error('Error eliminando colmena:', error);
  }
};

// ===== EJEMPLO DE USO COMBINADO =====

const ejemploCompleto = async () => {
  try {
    // 1. Inicializar BD
    await initDatabase();

    // 2. Crear un apiario
    const idApiario = await apiarioService.createApiario({
      nombre: 'Apiario de Prueba',
      descripcion: 'Ejemplo de uso',
      municipio: 'Valencia',
      fecha_creacion: new Date().toISOString(),
    });

    // 3. Crear colmenas en el apiario
    const idColmena1 = await colmenaService.createColmena({
      codigo_colmena: 'C-001',
      estado_general: 'Activo',
      fecha_instalacion: new Date().toISOString(),
      id_apiario: idApiario,
    });

    const idColmena2 = await colmenaService.createColmena({
      codigo_colmena: 'C-002',
      estado_general: 'Vuelo',
      fecha_instalacion: new Date().toISOString(),
      observaciones: 'Volada recientemente',
      id_apiario: idApiario,
    });

    // 4. Obtener todas las colmenas del apiario
    const colmenas = await colmenaService.getColmenasByApiario(idApiario);
    console.log(`El apiario tiene ${colmenas.length} colmenas`);

    // 5. Actualizar una colmena
    await colmenaService.updateColmena(idColmena1, {
      estado_general: 'Fuerte',
    });

    // 6. Actualizar el apiario
    await apiarioService.updateApiario(idApiario, {
      municipio: 'Bilbao',
    });

    console.log('Ejemplo completado exitosamente!');
  } catch (error) {
    console.error('Error en ejemplo:', error);
  }
};

// Exportar para uso en otros componentes
export {
    actualizarApiario, actualizarColmena, crearApiario, crearColmena, ejemploCompleto, ejemploInit, eliminarApiario, eliminarColmena, obtenerApiario, obtenerColmena, obtenerColmenasDelApiario, obtenerTodosApiarios
};

