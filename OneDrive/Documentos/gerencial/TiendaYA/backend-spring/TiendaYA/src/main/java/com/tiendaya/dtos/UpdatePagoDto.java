package com.tiendaya.dtos;

import com.tiendaya.models.enums.EstadoPago;
import com.tiendaya.models.enums.MetodoPago;

import java.math.BigDecimal;

public record UpdatePagoDto(
        MetodoPago metodo,
        BigDecimal monto,
        EstadoPago estadoPago,
        String fechaPago,
        Boolean activo
) {
}