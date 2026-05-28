package com.tiendaya.dtos;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateCierreCajaDto(
        Integer usuarioId,

        @NotNull(message = "El monto base inicial es obligatorio")
        BigDecimal montoBaseInicial,

        @NotNull(message = "El efectivo esperado es obligatorio")
        BigDecimal efectivoEsperado,

        @NotNull(message = "El efectivo contado es obligatorio")
        BigDecimal efectivoContado,

        @NotNull(message = "La diferencia es obligatoria")
        BigDecimal diferencia,

        @NotNull(message = "El total recaudado es obligatorio")
        BigDecimal totalRecaudado,

        String observaciones
) {
}