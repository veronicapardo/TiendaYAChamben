import express from "express";
import cors from "cors";
import "dotenv/config";
import { prisma } from "./lib/prisma.js";

import productoRoutes from "./routes/producto.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

const puerto = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.send("API TiendaYA funcionando correctamente");
});

app.get("/db-test", async (_req, res) => {
  try {
    const resultado = await prisma.$queryRaw<{ now: Date }[]>`
      SELECT NOW() as now
    `;

    res.json({
      mensaje: "Conexión correcta con PostgreSQL usando Prisma",
      fecha: resultado[0]
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al conectar con PostgreSQL usando Prisma",
      error
    });
  }
});

app.use("/productos", productoRoutes);

app.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});