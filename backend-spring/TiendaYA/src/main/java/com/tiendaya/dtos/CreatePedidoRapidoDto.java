package com.tiendaya.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.math.BigDecimal;
import java.util.List;

public record CreatePedidoRapidoDto(
        @NotBlank(message = "El nombre del cliente es obligatorio")
        String clienteNombre,

        @NotBlank(message = "El teléfono del cliente es obligatorio")
        String clienteTelefono,

        @NotBlank(message = "La dirección de entrega es obligatoria")
        String direccionEntrega,

        String referenciaEntrega,

        String zona,

        String observaciones,

        Integer repartidorId,

        BigDecimal costoEnvio,

        @NotEmpty(message = "El pedido debe tener al menos un producto")
        List<@Valid PedidoProductoDto> productos
) {
}