package com.tiendaya.interfaces;

import com.tiendaya.dtos.CreateVentaDto;
import com.tiendaya.dtos.UpdateVentaDto;
import com.tiendaya.models.Venta;
import com.tiendaya.models.enums.EstadoVenta;
import com.tiendaya.dtos.CreateVentaRapidaDto;
import com.tiendaya.dtos.ConvertirPedidoVentaDto;

import java.util.List;
import java.util.Optional;

public interface IVentaService {

    List<Venta> getVentas();

    Optional<Venta> getVenta(Integer id);

    Optional<Venta> getVentaPorPedido(Integer pedidoId);

    List<Venta> getVentasPorEstado(EstadoVenta estadoVenta);

    Venta createVenta(CreateVentaDto dto);

    Optional<Venta> updateVenta(Integer id, UpdateVentaDto dto);

    Optional<Venta> deleteVenta(Integer id);

    Venta convertirPedidoEnVenta(Integer pedidoId, ConvertirPedidoVentaDto dto);

    Venta createVentaRapida(CreateVentaRapidaDto dto);
}