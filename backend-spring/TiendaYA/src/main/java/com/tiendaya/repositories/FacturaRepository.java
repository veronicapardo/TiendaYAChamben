package com.tiendaya.repositories;

import com.tiendaya.models.Factura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FacturaRepository extends JpaRepository<Factura, Integer> {

    Optional<Factura> findByVentaId(Integer ventaId);

    boolean existsByVentaId(Integer ventaId);
}