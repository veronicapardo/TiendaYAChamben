package com.tiendaya.repositories;

import com.tiendaya.models.Pedido;
import com.tiendaya.models.enums.EstadoPedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Integer> {

    List<Pedido> findAllByOrderByIdAsc();

    List<Pedido> findByClienteIdOrderByIdAsc(Integer clienteId);

    List<Pedido> findByEstadoOrderByIdAsc(EstadoPedido estado);
}