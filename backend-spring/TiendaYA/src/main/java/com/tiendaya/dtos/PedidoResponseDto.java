package com.tiendaya.dtos;

import com.tiendaya.models.enums.EstadoPedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponseDto(
        Integer id,
        Integer clienteId,
        String clienteNombre,
        String clienteTelefono,
        Integer repartidorId,
        String repartidorNombre,
        LocalDateTime fechaHora,
        String direccionEntrega,
        EstadoPedido estado,
        BigDecimal total,
        List<PedidoDetalleResponseDto> detalles,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}