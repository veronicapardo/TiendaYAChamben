package com.tiendaya.dtos;

import com.tiendaya.models.enums.RolUsuario;

import java.time.LocalDateTime;

public record UsuarioResponseDto(
        Integer id,
        String nombre,
        String email,
        RolUsuario rol,
        Boolean activo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}