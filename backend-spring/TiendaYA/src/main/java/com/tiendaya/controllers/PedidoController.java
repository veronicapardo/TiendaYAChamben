package com.tiendaya.controllers;

import com.tiendaya.dtos.*;
import com.tiendaya.interfaces.IPedidoService;
import com.tiendaya.models.Pedido;
import com.tiendaya.models.PedidoDetalle;
import com.tiendaya.models.enums.EstadoPedido;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tiendaya.dtos.CreatePedidoRapidoDto;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/v1/pedidos")
public class PedidoController {

    private final IPedidoService pedidoService;

    public PedidoController(IPedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponseDto>> getPedidos() {
        List<PedidoResponseDto> pedidos = pedidoService.getPedidos()
                .stream()
                .map(this::convertirAResponseDto)
                .toList();

        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPedido(@PathVariable Integer id) {
        Optional<Pedido> pedido = pedidoService.getPedido(id);

        if (pedido.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El pedido con id " + id + " no existe"));
        }

        return ResponseEntity.ok(convertirAResponseDto(pedido.get()));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<PedidoResponseDto>> getPedidosPorCliente(@PathVariable Integer clienteId) {
        List<PedidoResponseDto> pedidos = pedidoService.getPedidosPorCliente(clienteId)
                .stream()
                .map(this::convertirAResponseDto)
                .toList();

        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<PedidoResponseDto>> getPedidosPorEstado(@PathVariable EstadoPedido estado) {
        List<PedidoResponseDto> pedidos = pedidoService.getPedidosPorEstado(estado)
                .stream()
                .map(this::convertirAResponseDto)
                .toList();

        return ResponseEntity.ok(pedidos);
    }

    @PostMapping
    public ResponseEntity<?> createPedido(@Valid @RequestBody CreatePedidoDto dto) {
        try {
            Pedido pedido = pedidoService.createPedido(dto);

            return ResponseEntity
                    .status(201)
                    .body(convertirAResponseDto(pedido));
        } catch (IllegalArgumentException error) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageDto(error.getMessage()));
        }
    }

    @PostMapping("/rapido")
    public ResponseEntity<?> createPedidoRapido(@Valid @RequestBody CreatePedidoRapidoDto dto) {
        try {
            Pedido pedido = pedidoService.createPedidoRapido(dto);

            return ResponseEntity
                    .status(201)
                    .body(convertirAResponseDto(pedido));
        } catch (IllegalArgumentException error) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageDto(error.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePedido(
            @PathVariable Integer id,
            @RequestBody UpdatePedidoDto dto
    ) {
        try {
            Optional<Pedido> pedido = pedidoService.updatePedido(id, dto);

            if (pedido.isEmpty()) {
                return ResponseEntity
                        .status(404)
                        .body(new MessageDto("El pedido con id " + id + " no existe"));
            }

            return ResponseEntity.ok(convertirAResponseDto(pedido.get()));
        } catch (IllegalArgumentException error) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageDto(error.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePedido(@PathVariable Integer id) {
        Optional<Pedido> pedido = pedidoService.deletePedido(id);

        if (pedido.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El pedido con id " + id + " no existe"));
        }

        return ResponseEntity.ok(new MessageDto("Pedido cancelado correctamente"));
    }

    private PedidoResponseDto convertirAResponseDto(Pedido pedido) {
        return new PedidoResponseDto(
                pedido.getId(),
                pedido.getCliente().getId(),
                pedido.getCliente().getNombre(),
                pedido.getRepartidor() != null ? pedido.getRepartidor().getId() : null,
                pedido.getRepartidor() != null ? pedido.getRepartidor().getNombre() : null,
                pedido.getFechaHora(),
                pedido.getDireccionEntrega(),
                pedido.getEstado(),
                pedido.getTotal(),
                pedido.getDetalles()
                        .stream()
                        .map(this::convertirDetalleAResponseDto)
                        .toList(),
                pedido.getCreatedAt(),
                pedido.getUpdatedAt()
        );
    }

    private PedidoDetalleResponseDto convertirDetalleAResponseDto(PedidoDetalle detalle) {
        return new PedidoDetalleResponseDto(
                detalle.getId(),
                detalle.getProducto().getId(),
                detalle.getProducto().getNombre(),
                detalle.getCantidad(),
                detalle.getPrecioUnitario(),
                detalle.getSubtotal()
        );
    }
}