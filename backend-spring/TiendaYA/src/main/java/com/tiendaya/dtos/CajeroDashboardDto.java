package com.tiendaya.dtos;

import java.util.List;

public record CajeroDashboardDto(
        DashboardResumenDto resumen,
        List<DashboardPedidoDto> pedidosPendientes,
        List<DashboardAlertaDto> alertas,
        DashboardEstadoSistemaDto estadoSistema
) {
}