package com.tiendaya.repositories;

import com.tiendaya.models.CierreCaja;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface CierreCajaRepository extends JpaRepository<CierreCaja, Integer> {

    Optional<CierreCaja> findTopByActivoTrueAndFechaCierreBetweenOrderByFechaCierreDesc(
            LocalDateTime inicio,
            LocalDateTime fin
    );
}