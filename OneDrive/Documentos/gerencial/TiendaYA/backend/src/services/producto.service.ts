import { prisma } from "../lib/prisma.js";
import type { CreateProductoDto, UpdateProductoDto } from "../dtos/producto.dto.js";
import type { IProductoService } from "../interfaces/producto.service.interface.js";

export class ProductoService implements IProductoService {
  async getProductos() {
    return await prisma.producto.findMany({
      orderBy: {
        id: "asc"
      }
    });
  }

  async getProducto(id: number) {
    return await prisma.producto.findUnique({
      where: {
        id
      }
    });
  }

  async createProducto(data: CreateProductoDto) {
    return await prisma.producto.create({
      data: {
        nombre: data.nombre,
        categoria: data.categoria,
        precio: Number(data.precio),
        stock: Number(data.stock),
        fechaVencimiento: data.fechaVencimiento
          ? new Date(data.fechaVencimiento)
          : null
      }
    });
  }

  async updateProducto(id: number, data: UpdateProductoDto) {
    const productoExiste = await prisma.producto.findUnique({
      where: {
        id
      }
    });

    if (!productoExiste) {
      return null;
    }

    return await prisma.producto.update({
      where: {
        id
      },
      data: {
        nombre: data.nombre,
        categoria: data.categoria,
        precio: data.precio !== undefined ? Number(data.precio) : undefined,
        stock: data.stock !== undefined ? Number(data.stock) : undefined,
        fechaVencimiento: data.fechaVencimiento
          ? new Date(data.fechaVencimiento)
          : undefined,
        activo: data.activo
      }
    });
  }

  async deleteProducto(id: number) {
    const productoExiste = await prisma.producto.findUnique({
      where: {
        id
      }
    });

    if (!productoExiste) {
      return null;
    }

    return await prisma.producto.update({
      where: {
        id
      },
      data: {
        activo: false
      }
    });
  }
}