package com.tiendaya.services;

import com.tiendaya.dtos.CreateUsuarioDto;
import com.tiendaya.dtos.UpdateUsuarioDto;
import com.tiendaya.interfaces.IUsuarioService;
import com.tiendaya.models.Usuario;
import com.tiendaya.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService implements IUsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<Usuario> getUsuarios() {
        return usuarioRepository.findByActivoTrueOrderByIdAsc();
    }

    @Override
    public Optional<Usuario> getUsuario(Integer id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public Optional<Usuario> getUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    public Usuario createUsuario(CreateUsuarioDto dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        Usuario usuario = new Usuario();

        usuario.setNombre(dto.nombre());
        usuario.setEmail(dto.email());
        usuario.setPassword(dto.password());
        usuario.setRol(dto.rol());
        usuario.setActivo(true);

        return usuarioRepository.save(usuario);
    }

    @Override
    public Optional<Usuario> updateUsuario(Integer id, UpdateUsuarioDto dto) {
        Optional<Usuario> usuarioBuscado = usuarioRepository.findById(id);

        if (usuarioBuscado.isEmpty()) {
            return Optional.empty();
        }

        Usuario usuario = usuarioBuscado.get();

        if (dto.email() != null && !dto.email().equals(usuario.getEmail())) {
            if (usuarioRepository.existsByEmail(dto.email())) {
                throw new IllegalArgumentException("El email ya está registrado por otro usuario");
            }

            usuario.setEmail(dto.email());
        }

        if (dto.nombre() != null) {
            usuario.setNombre(dto.nombre());
        }

        if (dto.password() != null) {
            usuario.setPassword(dto.password());
        }

        if (dto.rol() != null) {
            usuario.setRol(dto.rol());
        }

        if (dto.activo() != null) {
            usuario.setActivo(dto.activo());
        }

        Usuario usuarioActualizado = usuarioRepository.save(usuario);

        return Optional.of(usuarioActualizado);
    }

    @Override
    public Optional<Usuario> deleteUsuario(Integer id) {
        Optional<Usuario> usuarioBuscado = usuarioRepository.findById(id);

        if (usuarioBuscado.isEmpty()) {
            return Optional.empty();
        }

        Usuario usuario = usuarioBuscado.get();
        usuario.setActivo(false);

        Usuario usuarioDesactivado = usuarioRepository.save(usuario);

        return Optional.of(usuarioDesactivado);
    }
}