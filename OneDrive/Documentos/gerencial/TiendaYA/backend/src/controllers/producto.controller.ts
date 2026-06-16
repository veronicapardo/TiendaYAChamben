import type { Request, Response } from "express";
import { ProductoService } from "../services/producto.service.js";

export class ProductoController {
  private productoService: ProductoService;

  constructor() {
    this.productoService = new ProductoService();
  }

  getProductos = async (_req: Request, res: Response) => {
    try {
      const productos = await this.productoService.getProductos();

      return res.status(200).json(productos);
    } catch (error) {
      return res.status(500).json({
        mensaje: "Error al obtener productos",
        error
      });
    }
  };

  getProducto = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const producto = await this.productoService.getProducto(id);

      if (!producto) {
        return res.status(404).json({
          mensaje: `El producto con id ${id} no existe`
        });
      }

      return res.status(200).json(producto);
    } catch (error) {
      return res.status(500).json({
        mensaje: "Error al obtener producto",
        error
      });
    }
  };

  createProducto = async (req: Request, res: Response) => {
    try {
      const producto = await this.productoService.createProducto(req.body);

      return res.status(201).json(producto);
    } catch (error) {
      return res.status(500).json({
        mensaje: "Error al crear producto",
        error
      });
    }
  };

  updateProducto = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const producto = await this.productoService.updateProducto(id, req.body);

      if (!producto) {
        return res.status(404).json({
          mensaje: `El producto con id ${id} no existe`
        });
      }

      return res.status(200).json(producto);
    } catch (error) {
      return res.status(500).json({
        mensaje: "Error al actualizar producto",
        error
      });
    }
  };

  deleteProducto = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const producto = await this.productoService.deleteProducto(id);

      if (!producto) {
        return res.status(404).json({
          mensaje: `El producto con id ${id} no existe`
        });
      }

      return res.status(200).json({
        mensaje: "Producto desactivado correctamente",
        producto
      });
    } catch (error) {
      return res.status(500).json({
        mensaje: "Error al eliminar producto",
        error
      });
    }
  };
}