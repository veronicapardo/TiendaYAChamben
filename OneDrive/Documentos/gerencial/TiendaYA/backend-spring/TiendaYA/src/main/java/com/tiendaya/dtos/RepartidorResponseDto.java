package com.tiendaya.dtos;

import java.time.LocalDateTime;

public record RepartidorResponseDto(
        Integer id,
        UsuarioResponseDto usuario,
        String nombre,
        String telefono,
        Boolean estadoDisponible,
        Boolean activo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}