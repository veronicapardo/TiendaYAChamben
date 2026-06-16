package com.tiendaya.repositories;

import com.tiendaya.models.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    List<Cliente> findByActivoTrueOrderByIdAsc();

    Optional<Cliente> findByTelefono(String telefono);
}