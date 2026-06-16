package com.tiendaya.dtos;

import com.tiendaya.models.enums.MetodoPago;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ConvertirPedidoVentaDto(
        @NotNull(message = "El método de pago es obligatorio")
        MetodoPago metodoPago,

        BigDecimal montoRecibido,

        BigDecimal montoEfectivo,

        BigDecimal montoDigital,

        String referenciaPago,

        Boolean generarFactura,

        String nitCi,

        String razonSocial
) {
}