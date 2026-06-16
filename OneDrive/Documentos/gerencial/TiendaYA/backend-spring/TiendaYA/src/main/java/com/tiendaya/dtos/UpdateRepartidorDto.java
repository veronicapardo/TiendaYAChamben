package com.tiendaya.dtos;

public record UpdateRepartidorDto(
        Integer usuarioId,
        String nombre,
        String telefono,
        Boolean estadoDisponible,
        Boolean activo
) {
}