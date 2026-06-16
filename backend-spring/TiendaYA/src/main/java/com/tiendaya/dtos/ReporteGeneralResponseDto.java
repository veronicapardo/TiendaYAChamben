package com.tiendaya.dtos;

import java.math.BigDecimal;
import java.util.List;

public record ReporteGeneralResponseDto(
        BigDecimal ventasTotales,
        Integer pedidosEntregados,
        BigDecimal ticketPromedio,
        Integer facturasEmitidas,
        List<ReporteVentaDiaDto> ventasPorDia,
        List<ReporteMetodoPagoDto> metodosPago,
        List<ReporteProductoTopDto> productosTop,
        List<ReporteMovimientoDto> ultimosMovimientos,
        List<ReporteCanalDto> resumenCanal
) {
}