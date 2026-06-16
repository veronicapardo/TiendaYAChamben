package com.tiendaya.controllers;

import com.tiendaya.dtos.CreateRepartidorDto;
import com.tiendaya.dtos.MessageDto;
import com.tiendaya.dtos.RepartidorResponseDto;
import com.tiendaya.dtos.UpdateRepartidorDto;
import com.tiendaya.dtos.UsuarioResponseDto;
import com.tiendaya.interfaces.IRepartidorService;
import com.tiendaya.models.Repartidor;
import com.tiendaya.models.Usuario;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/v1/repartidores")
public class RepartidorController {

    private final IRepartidorService repartidorService;

    public RepartidorController(IRepartidorService repartidorService) {
        this.repartidorService = repartidorService;
    }

    @GetMapping
    public ResponseEntity<List<RepartidorResponseDto>> getRepartidores() {
        List<RepartidorResponseDto> repartidores = repartidorService.getRepartidores()
                .stream()
                .map(this::convertirAResponseDto)
                .toList();

        return ResponseEntity.ok(repartidores);
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<RepartidorResponseDto>> getRepartidoresDisponibles() {
        List<RepartidorResponseDto> repartidores = repartidorService.getRepartidoresDisponibles()
                .stream()
                .map(this::convertirAResponseDto)
                .toList();

        return ResponseEntity.ok(repartidores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRepartidor(@PathVariable Integer id) {
        Optional<Repartidor> repartidor = repartidorService.getRepartidor(id);

        if (repartidor.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El repartidor con id " + id + " no existe"));
        }

        return ResponseEntity.ok(convertirAResponseDto(repartidor.get()));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> getRepartidorPorUsuario(@PathVariable Integer usuarioId) {
        Optional<Repartidor> repartidor = repartidorService.getRepartidorPorUsuario(usuarioId);

        if (repartidor.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("No existe repartidor asociado al usuario con id " + usuarioId));
        }

        return ResponseEntity.ok(convertirAResponseDto(repartidor.get()));
    }

    @PostMapping
    public ResponseEntity<?> createRepartidor(@Valid @RequestBody CreateRepartidorDto dto) {
        try {
            Repartidor repartidor = repartidorService.createRepartidor(dto);

            return ResponseEntity
                    .status(201)
                    .body(convertirAResponseDto(repartidor));
        } catch (IllegalArgumentException error) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageDto(error.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRepartidor(
            @PathVariable Integer id,
            @RequestBody UpdateRepartidorDto dto
    ) {
        try {
            Optional<Repartidor> repartidor = repartidorService.updateRepartidor(id, dto);

            if (repartidor.isEmpty()) {
                return ResponseEntity
                        .status(404)
                        .body(new MessageDto("El repartidor con id " + id + " no existe"));
            }

            return ResponseEntity.ok(convertirAResponseDto(repartidor.get()));
        } catch (IllegalArgumentException error) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageDto(error.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRepartidor(@PathVariable Integer id) {
        Optional<Repartidor> repartidor = repartidorService.deleteRepartidor(id);

        if (repartidor.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El repartidor con id " + id + " no existe"));
        }

        return ResponseEntity.ok(new MessageDto("Repartidor desactivado correctamente"));
    }

    private RepartidorResponseDto convertirAResponseDto(Repartidor repartidor) {
        return new RepartidorResponseDto(
                repartidor.getId(),
                convertirUsuarioAResponseDto(repartidor.getUsuario()),
                repartidor.getNombre(),
                repartidor.getTelefono(),
                repartidor.getEstadoDisponible(),
                repartidor.getActivo(),
                repartidor.getCreatedAt(),
                repartidor.getUpdatedAt()
        );
    }

    private UsuarioResponseDto convertirUsuarioAResponseDto(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

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