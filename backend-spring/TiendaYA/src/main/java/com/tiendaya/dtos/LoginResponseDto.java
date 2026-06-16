package com.tiendaya.dtos;

import com.tiendaya.models.enums.RolUsuario;

public record LoginResponseDto(
        Integer id,
        String nombre,
        String email,
        RolUsuario rol
) {
}