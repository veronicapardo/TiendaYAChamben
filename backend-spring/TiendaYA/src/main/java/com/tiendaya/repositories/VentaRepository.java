package com.tiendaya.repositories;

import com.tiendaya.models.Venta;
import com.tiendaya.models.enums.EstadoVenta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VentaRepository extends JpaRepository<Venta, Integer> {

    List<Venta> findByActivoTrueOrderByIdAsc();

    Optional<Venta> findByPedidoId(Integer pedidoId);

    boolean existsByPedidoId(Integer pedidoId);

    boolean existsByPagoId(Integer pagoId);

    List<Venta> findByEstadoVentaOrderByIdAsc(EstadoVenta estadoVenta);
}