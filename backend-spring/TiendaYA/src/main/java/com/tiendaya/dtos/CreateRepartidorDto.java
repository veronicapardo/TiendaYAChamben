package com.tiendaya.dtos;

import jakarta.validation.constraints.NotBlank;

public record CreateRepartidorDto(
        Integer usuarioId,

        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "El teléfono es obligatorio")
        String telefono,

        Boolean estadoDisponible
) {
}