package com.tiendaya.dtos;

public record UpdateProveedorDto(
        String nombre,
        String contactoNombre,
        String telefono,
        String email,
        Boolean activo
) {
}