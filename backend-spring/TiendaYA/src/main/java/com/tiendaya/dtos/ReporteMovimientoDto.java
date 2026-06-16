package com.tiendaya.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ReporteMovimientoDto(
        LocalDateTime fecha,
        String tipo,
        String cliente,
        String metodo,
        BigDecimal total,
        String estado
) {
}