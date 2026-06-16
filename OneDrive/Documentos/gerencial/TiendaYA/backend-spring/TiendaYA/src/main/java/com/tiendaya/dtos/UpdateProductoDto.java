package com.tiendaya.dtos;

import java.math.BigDecimal;

public record UpdateProductoDto(
        String nombre,
        String categoria,
        BigDecimal precio,
        Integer stock,
        String fechaVencimiento,
        Boolean activo
) {
}