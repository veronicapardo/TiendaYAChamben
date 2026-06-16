package com.tiendaya.dtos;

import com.tiendaya.models.enums.EstadoPedido;

public record UpdatePedidoDto(
        Integer repartidorId,
        String direccionEntrega,
        EstadoPedido estado
) {
}