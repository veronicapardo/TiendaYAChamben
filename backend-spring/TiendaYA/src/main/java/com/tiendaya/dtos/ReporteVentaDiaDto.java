package com.tiendaya.dtos;

import java.math.BigDecimal;

public record ReporteVentaDiaDto(
        String dia,
        BigDecimal valor
) {
}