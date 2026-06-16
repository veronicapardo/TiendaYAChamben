import { Router } from "express";
import { ProductoController } from "../controllers/producto.controller.js";

const router = Router();
const productoController = new ProductoController();

router.get("/", productoController.getProductos);
router.get("/:id", productoController.getProducto);
router.post("/", productoController.createProducto);
router.put("/:id", productoController.updateProducto);
router.delete("/:id", productoController.deleteProducto);

export default router;