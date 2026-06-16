package com.tiendaya.dtos;

import com.tiendaya.models.enums.EstadoPago;
import com.tiendaya.models.enums.MetodoPago;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreatePagoDto(
        @NotNull(message = "El pedidoId es obligatorio")
        Integer pedidoId,

        @NotNull(message = "El método de pago es obligatorio")
        MetodoPago metodo,

        @DecimalMin(value = "0.0", inclusive = false, message = "El monto debe ser mayor a 0")
        BigDecimal monto,

        EstadoPago estadoPago,

        String fechaPago
) {
}