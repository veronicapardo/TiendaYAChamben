package com.tiendaya.dtos;

import com.tiendaya.models.enums.EstadoVenta;

import java.math.BigDecimal;

public record UpdateVentaDto(
        Integer pagoId,
        BigDecimal montoTotal,
        EstadoVenta estadoVenta,
        String comprobante,
        Boolean activo
) {
}