package com.tiendaya.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MovimientoCierreCajaDto(
        LocalDateTime fechaHora,
        String movimiento,
        String metodoPago,
        BigDecimal monto
) {
}