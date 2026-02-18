export interface Apiario {
  id_apiario: number;
  nombre: string;
  descripcion?: string;
  latitud?: number;
  longitud?: number;
  municipio?: string;
  fecha_creacion: string;
  id_usuario?: number;
  foto_url?: string;
}

export interface Colmena {
  id_colmena: number;
  codigo_colmena: string;
  estado_general?: string;
  fecha_instalacion: string;
  observaciones?: string;
  id_apiario: number;
  foto_url?: string;
  // runtime fields
  ultima_inspeccion_fecha?: string;
  ultima_inspeccion_estado?: string;
}

export interface ApiarioWithColmenas extends Apiario {
  colmenas: Colmena[];
}

export interface Inspeccion {
  id_inspeccion: number;
  fecha_inspeccion: string;
  estado_colmena?: string;
  observaciones?: string;
  id_colmena: number;
}

export interface Producto {
  id_producto: number;
  nombre: string;
}

export interface Produccion {
  id_produccion: number;
  fecha_cosecha: string;
  cantidad: number;
  observaciones?: string;
  id_colmena: number;
  id_apiario: number;
  id_producto: number;
  // runtime helper
  productoNombre?: string;
}
