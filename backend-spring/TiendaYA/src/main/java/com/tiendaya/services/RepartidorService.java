package com.tiendaya.services;

import com.tiendaya.dtos.CreateRepartidorDto;
import com.tiendaya.dtos.UpdateRepartidorDto;
import com.tiendaya.interfaces.IRepartidorService;
import com.tiendaya.models.Repartidor;
import com.tiendaya.models.Usuario;
import com.tiendaya.models.enums.RolUsuario;
import com.tiendaya.repositories.RepartidorRepository;
import com.tiendaya.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RepartidorService implements IRepartidorService {

    private final RepartidorRepository repartidorRepository;
    private final UsuarioRepository usuarioRepository;

    public RepartidorService(
            RepartidorRepository repartidorRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.repartidorRepository = repartidorRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<Repartidor> getRepartidores() {
        return repartidorRepository.findByActivoTrueOrderByIdAsc();
    }

    @Override
    public List<Repartidor> getRepartidoresDisponibles() {
        return repartidorRepository.findByActivoTrueAndEstadoDisponibleTrueOrderByIdAsc();
    }

    @Override
    public Optional<Repartidor> getRepartidor(Integer id) {
        return repartidorRepository.findById(id);
    }

    @Override
    public Optional<Repartidor> getRepartidorPorUsuario(Integer usuarioId) {
        return repartidorRepository.findByUsuarioId(usuarioId);
    }

    @Override
    public Repartidor createRepartidor(CreateRepartidorDto dto) {
        Repartidor repartidor = new Repartidor();

        if (dto.usuarioId() != null) {
            Usuario usuario = obtenerUsuarioValidoParaRepartidor(dto.usuarioId());

            if (repartidorRepository.existsByUsuarioId(dto.usuarioId())) {
                throw new IllegalArgumentException("Este usuario ya está asociado a un repartidor");
            }

            repartidor.setUsuario(usuario);
        }

        repartidor.setNombre(dto.nombre());
        repartidor.setTelefono(dto.telefono());
        repartidor.setEstadoDisponible(dto.estadoDisponible() != null ? dto.estadoDisponible() : true);
        repartidor.setActivo(true);

        return repartidorRepository.save(repartidor);
    }

    @Override
    public Optional<Repartidor> updateRepartidor(Integer id, UpdateRepartidorDto dto) {
        Optional<Repartidor> repartidorBuscado = repartidorRepository.findById(id);

        if (repartidorBuscado.isEmpty()) {
            return Optional.empty();
        }

        Repartidor repartidor = repartidorBuscado.get();

        if (dto.usuarioId() != null) {
            Usuario usuario = obtenerUsuarioValidoParaRepartidor(dto.usuarioId());

            Optional<Repartidor> repartidorConUsuario = repartidorRepository.findByUsuarioId(dto.usuarioId());

            if (repartidorConUsuario.isPresent() && !repartidorConUsuario.get().getId().equals(id)) {
                throw new IllegalArgumentException("Este usuario ya está asociado a otro repartidor");
            }

            repartidor.setUsuario(usuario);
        }

        if (dto.nombre() != null) {
            repartidor.setNombre(dto.nombre());
        }

        if (dto.telefono() != null) {
            repartidor.setTelefono(dto.telefono());
        }

        if (dto.estadoDisponible() != null) {
            repartidor.setEstadoDisponible(dto.estadoDisponible());
        }

        if (dto.activo() != null) {
            repartidor.setActivo(dto.activo());
        }

        Repartidor repartidorActualizado = repartidorRepository.save(repartidor);

        return Optional.of(repartidorActualizado);
    }

    @Override
    public Optional<Repartidor> deleteRepartidor(Integer id) {
        Optional<Repartidor> repartidorBuscado = repartidorRepository.findById(id);

        if (repartidorBuscado.isEmpty()) {
            return Optional.empty();
        }

        Repartidor repartidor = repartidorBuscado.get();
        repartidor.setActivo(false);
        repartidor.setEstadoDisponible(false);

        Repartidor repartidorDesactivado = repartidorRepository.save(repartidor);

        return Optional.of(repartidorDesactivado);
    }

    private Usuario obtenerUsuarioValidoParaRepartidor(Integer usuarioId) {
        Optional<Usuario> usuarioBuscado = usuarioRepository.findById(usuarioId);

        if (usuarioBuscado.isEmpty()) {
            throw new IllegalArgumentException("El usuario con id " + usuarioId + " no existe");
        }

        Usuario usuario = usuarioBuscado.get();

        if (!usuario.getActivo()) {
            throw new IllegalArgumentException("El usuario seleccionado está desactivado");
        }

        if (usuario.getRol() != RolUsuario.REPARTIDOR) {
            throw new IllegalArgumentException("El usuario seleccionado debe tener rol REPARTIDOR");
        }

        return usuario;
    }
}