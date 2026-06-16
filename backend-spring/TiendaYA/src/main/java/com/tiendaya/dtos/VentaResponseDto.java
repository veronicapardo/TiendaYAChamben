package com.tiendaya.dtos;

import com.tiendaya.models.enums.EstadoVenta;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record VentaResponseDto(
        Integer id,
        Integer pedidoId,
        Integer pagoId,
        String clienteNombre,
        LocalDateTime fechaVenta,
        BigDecimal montoTotal,
        EstadoVenta estadoVenta,
        String comprobante,
        Boolean activo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}