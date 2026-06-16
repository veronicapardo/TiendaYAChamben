package com.tiendaya.dtos;

import java.math.BigDecimal;

public record PedidoDetalleResponseDto(
        Integer id,
        Integer productoId,
        String productoNombre,
        Integer cantidad,
        BigDecimal precioUnitario,
        BigDecimal subtotal
) {
}