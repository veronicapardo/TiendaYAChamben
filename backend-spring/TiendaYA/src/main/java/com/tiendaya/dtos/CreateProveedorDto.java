package com.tiendaya.dtos;

import jakarta.validation.constraints.NotBlank;

public record CreateProveedorDto(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "El nombre de contacto es obligatorio")
        String contactoNombre,

        @NotBlank(message = "El teléfono es obligatorio")
        String telefono,

        String email
) {
}