package com.tiendaya.dtos;

public record DashboardAlertaDto(
        String tipo,
        String productoNombre,
        String detalle,
        String imageUrl
) {
}