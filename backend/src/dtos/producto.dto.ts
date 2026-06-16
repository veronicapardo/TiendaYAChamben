export interface CreateProductoDto {
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  fechaVencimiento?: string | null;
}

export interface UpdateProductoDto {
  nombre?: string;
  categoria?: string;
  precio?: number;
  stock?: number;
  fechaVencimiento?: string | null;
  activo?: boolean;
}