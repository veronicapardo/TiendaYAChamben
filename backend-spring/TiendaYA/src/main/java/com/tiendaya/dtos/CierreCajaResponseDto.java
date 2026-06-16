package com.tiendaya.dtos;

import java.math.BigDecimal;
import java.util.List;

public record CierreCajaResponseDto(
        BigDecimal ventasDelDia,
        Integer transacciones,
        Integer facturasEmitidas,
        Integer pedidosConvertidos,
        BigDecimal efectivo,
        BigDecimal qrTransferencia,
        BigDecimal mixto,
        BigDecimal enviosCobrados,
        BigDecimal descuentosAplicados,
        BigDecimal totalRecaudado,
        List<MovimientoCierreCajaDto> ultimosMovimientos
) {
}