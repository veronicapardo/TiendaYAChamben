package com.tiendaya.dtos;

public record UpdateClienteDto(
        String nombre,
        String telefono,
        String direccion,
        Boolean activo
) {
}