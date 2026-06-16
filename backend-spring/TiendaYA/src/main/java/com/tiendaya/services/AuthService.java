package com.tiendaya.services;

import com.tiendaya.dtos.LoginRequestDto;
import com.tiendaya.dtos.LoginResponseDto;
import com.tiendaya.interfaces.IAuthService;
import com.tiendaya.models.Usuario;
import com.tiendaya.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements IAuthService {

    private final UsuarioRepository usuarioRepository;

    public AuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public LoginResponseDto login(LoginRequestDto dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales incorrectas"));

        if (!usuario.getActivo()) {
            throw new IllegalArgumentException("El usuario está desactivado");
        }

        if (!usuario.getPassword().equals(dto.password())) {
            throw new IllegalArgumentException("Credenciales incorrectas");
        }

        if (usuario.getRol() != dto.rol()) {
            throw new IllegalArgumentException("El usuario no tiene permiso para ingresar con este rol");
        }

        return new LoginResponseDto(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol()
        );
    }
}