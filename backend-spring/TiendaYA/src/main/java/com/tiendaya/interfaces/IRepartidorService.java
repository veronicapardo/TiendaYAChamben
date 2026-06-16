package com.tiendaya.interfaces;

import com.tiendaya.dtos.CreateRepartidorDto;
import com.tiendaya.dtos.UpdateRepartidorDto;
import com.tiendaya.models.Repartidor;

import java.util.List;
import java.util.Optional;

public interface IRepartidorService {

    List<Repartidor> getRepartidores();

    List<Repartidor> getRepartidoresDisponibles();

    Optional<Repartidor> getRepartidor(Integer id);

    Optional<Repartidor> getRepartidorPorUsuario(Integer usuarioId);

    Repartidor createRepartidor(CreateRepartidorDto dto);

    Optional<Repartidor> updateRepartidor(Integer id, UpdateRepartidorDto dto);

    Optional<Repartidor> deleteRepartidor(Integer id);
}