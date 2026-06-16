package com.tiendaya.dtos;

import java.math.BigDecimal;

public record DashboardResumenDto(
        BigDecimal ventasDelDia,
        Long pedidosActivos,
        BigDecimal totalEfectivo,
        BigDecimal totalQrTransferencia
) {
}