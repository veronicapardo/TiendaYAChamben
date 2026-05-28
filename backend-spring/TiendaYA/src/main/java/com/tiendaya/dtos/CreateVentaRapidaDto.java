package com.tiendaya.dtos;

import com.tiendaya.models.enums.MetodoPago;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record CreateVentaRapidaDto(
        Integer clienteId,

        String clienteNombre,

        String observaciones,

        @NotNull(message = "El método de pago es obligatorio")
        MetodoPago metodoPago,

        BigDecimal montoRecibido,

        BigDecimal montoEfectivo,

        BigDecimal montoDigital,

        BigDecimal costoEnvio,

        String referenciaPago,

        Boolean generarFactura,

        String nitCi,

        String razonSocial,

        @NotEmpty(message = "La venta debe tener al menos un producto")
        List<@Valid PedidoProductoDto> productos
) {
}