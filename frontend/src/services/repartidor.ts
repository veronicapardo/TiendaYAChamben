export function obtenerRepartidorId(
  usuarioId: number
): number {

  // MAPEO TEMPORAL
  // usuario.id -> repartidorId

  const mapa: Record<number, number> = {

    8: 3,
    3: 1,
    10: 3


    // agrega más si necesitas
    // 9: 1,
    // 10: 2,

  };

  return mapa[usuarioId] || usuarioId;
}