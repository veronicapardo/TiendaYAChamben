import type { CreateProductoDto, UpdateProductoDto } from "../dtos/producto.dto.js";

export interface IProductoService {
  getProductos(): Promise<unknown>;
  getProducto(id: number): Promise<unknown | null>;
  createProducto(data: CreateProductoDto): Promise<unknown>;
  updateProducto(id: number, data: UpdateProductoDto): Promise<unknown | null>;
  deleteProducto(id: number): Promise<unknown | null>;
}