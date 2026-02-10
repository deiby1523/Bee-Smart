export interface Apiario {
  id_apiario: number;
  nombre: string;
  descripcion?: string;
  latitud?: number;
  longitud?: number;
  municipio?: string;
  fecha_creacion: string;
  id_usuario?: number;
}

export interface Colmena {
  id_colmena: number;
  codigo_colmena: string;
  estado_general?: string;
  fecha_instalacion: string;
  observaciones?: string;
  id_apiario: number;
}

export interface ApiarioWithColmenas extends Apiario {
  colmenas: Colmena[];
}
