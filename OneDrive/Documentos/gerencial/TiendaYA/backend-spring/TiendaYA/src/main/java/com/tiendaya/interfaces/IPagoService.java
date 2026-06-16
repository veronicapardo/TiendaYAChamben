package com.tiendaya.interfaces;

import com.tiendaya.dtos.CreatePagoDto;
import com.tiendaya.dtos.UpdatePagoDto;
import com.tiendaya.models.Pago;
import com.tiendaya.models.enums.EstadoPago;

import java.util.List;
import java.util.Optional;

public interface IPagoService {

    List<Pago> getPagos();

    Optional<Pago> getPago(Integer id);

    Optional<Pago> getPagoPorPedido(Integer pedidoId);

    List<Pago> getPagosPorEstado(EstadoPago estadoPago);

    Pago createPago(CreatePagoDto dto);

    Optional<Pago> updatePago(Integer id, UpdatePagoDto dto);

    Optional<Pago> deletePago(Integer id);
}