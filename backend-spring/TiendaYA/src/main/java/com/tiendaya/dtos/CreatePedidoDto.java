package com.tiendaya.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreatePedidoDto(
        @NotNull(message = "El clienteId es obligatorio")
        Integer clienteId,

        Integer repartidorId,

        @NotBlank(message = "La dirección de entrega es obligatoria")
        String direccionEntrega,

        @NotEmpty(message = "El pedido debe tener al menos un producto")
        List<@Valid PedidoProductoDto> productos
) {
}