package com.tiendaya.dtos;

public record DashboardEstadoSistemaDto(
        Boolean online,
        Boolean sincronizado,
        Integer datosPendientes
) {
}