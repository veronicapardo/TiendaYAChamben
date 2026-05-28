package com.tiendaya.dtos;

import com.tiendaya.models.enums.EstadoVenta;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateVentaDto(
        @NotNull(message = "El pedidoId es obligatorio")
        Integer pedidoId,

        Integer pagoId,

        @DecimalMin(value = "0.0", inclusive = false, message = "El monto total debe ser mayor a 0")
        BigDecimal montoTotal,

        EstadoVenta estadoVenta,

        BigDecimal costoEnvio,

        String comprobante
) {
}