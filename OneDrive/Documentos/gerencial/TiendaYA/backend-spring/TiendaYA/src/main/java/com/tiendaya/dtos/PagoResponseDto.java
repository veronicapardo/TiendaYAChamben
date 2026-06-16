package com.tiendaya.dtos;

import com.tiendaya.models.enums.EstadoPago;
import com.tiendaya.models.enums.MetodoPago;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PagoResponseDto(
        Integer id,
        Integer pedidoId,
        String clienteNombre,
        MetodoPago metodo,
        BigDecimal monto,
        EstadoPago estadoPago,
        LocalDateTime fechaPago,
        Boolean activo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}