const API_URL = "http://localhost:3000";

export type RepartidorActual = {
  id: number;
  nombre: string;
  telefono?: string;
  activo?: boolean;
  estadoDisponible?: boolean;
};

export async function obtenerRepartidorPorUsuario(usuarioId: number): Promise<RepartidorActual> {
  const respuesta = await fetch(`${API_URL}/v1/repartidores/usuario/${usuarioId}`);

  let contenido: any = null;

  try {
    contenido = await respuesta.json();
  } catch {
    contenido = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      contenido?.mensaje ||
        contenido?.message ||
        contenido?.error ||
        "No se pudo obtener el repartidor asociado al usuario"
    );
  }

  return contenido;
}