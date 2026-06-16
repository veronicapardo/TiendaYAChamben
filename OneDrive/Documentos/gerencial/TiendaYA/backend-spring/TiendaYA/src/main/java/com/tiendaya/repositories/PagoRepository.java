package com.tiendaya.repositories;

import com.tiendaya.models.Pago;
import com.tiendaya.models.enums.EstadoPago;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PagoRepository extends JpaRepository<Pago, Integer> {

    List<Pago> findByActivoTrueOrderByIdAsc();

    Optional<Pago> findByPedidoId(Integer pedidoId);

    boolean existsByPedidoId(Integer pedidoId);

    List<Pago> findByEstadoPagoOrderByIdAsc(EstadoPago estadoPago);
}