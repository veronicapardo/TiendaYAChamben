package com.tiendaya.dtos;

import java.math.BigDecimal;

public record ReporteCanalDto(
        String nombre,
        BigDecimal total,
        Integer porcentaje,
        Integer transacciones
) {
}