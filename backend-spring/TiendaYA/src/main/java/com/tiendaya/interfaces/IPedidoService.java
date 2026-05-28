package com.tiendaya.interfaces;

import com.tiendaya.dtos.CreatePedidoDto;
//import com.tiendaya.dtos.PedidoResponseDto;
import com.tiendaya.dtos.UpdatePedidoDto;
import com.tiendaya.models.Pedido;
import com.tiendaya.models.enums.EstadoPedido;

//import java.util.Collection;
import java.util.List;
import java.util.Optional;


public interface IPedidoService {

    List<Pedido> getPedidos();

    Optional<Pedido> getPedido(Integer id);

    List<Pedido> getPedidosPorCliente(Integer clienteId);

    //List<Pedido> getPedidosPorEstado(Integer repartidorId);

    Pedido createPedido(CreatePedidoDto dto);

    Optional<Pedido> updatePedido(Integer id, UpdatePedidoDto dto);

    Optional<Pedido> deletePedido(Integer id);

    // En IPedidoService.java
    List<Pedido> getPedidosPorRepartidor(Integer repartidorId);
    Optional<Pedido> actualizarEstado(Integer id, EstadoPedido nuevoEstado);

    //Collection<PedidoResponseDto> getPedidosPorEstado(EstadoPedido estado);
    List<Pedido> getPedidosPorEstado(EstadoPedido estado);
}