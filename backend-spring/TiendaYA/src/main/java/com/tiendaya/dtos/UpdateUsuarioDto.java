package com.tiendaya.dtos;

import com.tiendaya.models.enums.RolUsuario;
import jakarta.validation.constraints.Email;

public record UpdateUsuarioDto(
        String nombre,

        @Email(message = "El email no tiene un formato válido")
        String email,

        String password,
        RolUsuario rol,
        Boolean activo
) {
}