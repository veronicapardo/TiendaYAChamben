package com.tiendaya.repositories;

import com.tiendaya.models.Repartidor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RepartidorRepository extends JpaRepository<Repartidor, Integer> {

    List<Repartidor> findByActivoTrueOrderByIdAsc();

    List<Repartidor> findByActivoTrueAndEstadoDisponibleTrueOrderByIdAsc();

    Optional<Repartidor> findByUsuarioId(Integer usuarioId);

    boolean existsByUsuarioId(Integer usuarioId);
}