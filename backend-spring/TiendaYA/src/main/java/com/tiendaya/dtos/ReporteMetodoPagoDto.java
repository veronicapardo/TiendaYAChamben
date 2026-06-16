package com.tiendaya.dtos;

import java.math.BigDecimal;

public record ReporteMetodoPagoDto(
        String label,
        Integer pct,
        BigDecimal monto
) {
}