package com.tiendaya.dtos;

import com.tiendaya.models.enums.EstadoFactura;
import com.tiendaya.models.enums.MetodoPago;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FacturaResponseDto(
        Integer id,
        Integer ventaId,
        String nitCi,
        String razonSocial,
        LocalDateTime fechaEmision,
        BigDecimal total,
        MetodoPago metodoPago,
        EstadoFactura estadoFactura
) {
}