package com.tiendaya.repositories;

import com.tiendaya.models.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    List<Producto> findByActivoTrueOrderByIdAsc();
}