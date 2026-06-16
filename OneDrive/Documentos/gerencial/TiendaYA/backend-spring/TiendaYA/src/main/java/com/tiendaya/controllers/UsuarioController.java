package com.tiendaya.controllers;

import com.tiendaya.dtos.CreateUsuarioDto;
import com.tiendaya.dtos.MessageDto;
import com.tiendaya.dtos.UpdateUsuarioDto;
import com.tiendaya.dtos.UsuarioResponseDto;
import com.tiendaya.interfaces.IUsuarioService;
import com.tiendaya.models.Usuario;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/v1/usuarios")
public class UsuarioController {

    private final IUsuarioService usuarioService;

    public UsuarioController(IUsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDto>> getUsuarios() {
        List<UsuarioResponseDto> usuarios = usuarioService.getUsuarios()
                .stream()
                .map(this::convertirAResponseDto)
                .toList();

        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUsuario(@PathVariable Integer id) {
        Optional<Usuario> usuario = usuarioService.getUsuario(id);

        if (usuario.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El usuario con id " + id + " no existe"));
        }

        return ResponseEntity.ok(convertirAResponseDto(usuario.get()));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUsuarioPorEmail(@PathVariable String email) {
        Optional<Usuario> usuario = usuarioService.getUsuarioPorEmail(email);

        if (usuario.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El usuario con email " + email + " no existe"));
        }

        return ResponseEntity.ok(convertirAResponseDto(usuario.get()));
    }

    @PostMapping
    public ResponseEntity<?> createUsuario(@Valid @RequestBody CreateUsuarioDto dto) {
        try {
            Usuario usuario = usuarioService.createUsuario(dto);

            return ResponseEntity
                    .status(201)
                    .body(convertirAResponseDto(usuario));
        } catch (IllegalArgumentException error) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageDto(error.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUsuario(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateUsuarioDto dto
    ) {
        try {
            Optional<Usuario> usuario = usuarioService.updateUsuario(id, dto);

            if (usuario.isEmpty()) {
                return ResponseEntity
                        .status(404)
                        .body(new MessageDto("El usuario con id " + id + " no existe"));
            }

            return ResponseEntity.ok(convertirAResponseDto(usuario.get()));
        } catch (IllegalArgumentException error) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageDto(error.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUsuario(@PathVariable Integer id) {
        Optional<Usuario> usuario = usuarioService.deleteUsuario(id);

        if (usuario.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El usuario con id " + id + " no existe"));
        }

        return ResponseEntity.ok(new MessageDto("Usuario desactivado correctamente"));
    }

    private UsuarioResponseDto convertirAResponseDto(Usuario usuario) {
        return new UsuarioResponseDto(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getActivo(),
                usuario.getCreatedAt(),
                usuario.getUpdatedAt()
        );
    }
}