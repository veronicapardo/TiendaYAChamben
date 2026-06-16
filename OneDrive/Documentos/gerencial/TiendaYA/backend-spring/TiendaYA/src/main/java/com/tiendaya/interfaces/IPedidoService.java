package com.tiendaya.interfaces;

import com.tiendaya.dtos.CreatePedidoDto;
import com.tiendaya.dtos.UpdatePedidoDto;
import com.tiendaya.models.Pedido;
import com.tiendaya.models.enums.EstadoPedido;

import java.util.List;
import java.util.Optional;

public interface IPedidoService {

    List<Pedido> getPedidos();

    Optional<Pedido> getPedido(Integer id);

    List<Pedido> getPedidosPorCliente(Integer clienteId);

    List<Pedido> getPedidosPorEstado(EstadoPedido estado);

    Pedido createPedido(CreatePedidoDto dto);

    Optional<Pedido> updatePedido(Integer id, UpdatePedidoDto dto);

    Optional<Pedido> deletePedido(Integer id);
}