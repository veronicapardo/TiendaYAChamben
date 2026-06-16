package com.tiendaya.dtos;

import com.tiendaya.models.enums.EstadoPedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DashboardPedidoDto(
        Integer id,
        String clienteNombre,
        String telefono,
        EstadoPedido estado,
        BigDecimal total,
        String metodoPago,
        LocalDateTime fechaHora
) {
}