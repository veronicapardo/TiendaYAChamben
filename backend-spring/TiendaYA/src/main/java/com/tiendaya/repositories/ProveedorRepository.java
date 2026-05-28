package com.tiendaya.repositories;

import com.tiendaya.models.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProveedorRepository extends JpaRepository<Proveedor, Integer> {

    List<Proveedor> findByActivoTrueOrderByIdAsc();
}