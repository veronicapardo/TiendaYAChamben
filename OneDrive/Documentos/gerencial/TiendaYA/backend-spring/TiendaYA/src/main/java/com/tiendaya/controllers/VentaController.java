package com.tiendaya.controllers;

import com.tiendaya.dtos.CreateVentaDto;
import com.tiendaya.dtos.MessageDto;
import com.tiendaya.dtos.UpdateVentaDto;
import com.tiendaya.dtos.VentaResponseDto;
import com.tiendaya.interfaces.IVentaService;
import com.tiendaya.models.Venta;
import com.tiendaya.models.enums.EstadoVenta;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/v1/ventas")
public class VentaController {

    private final IVentaService ventaService;

    public VentaController(IVentaService ventaService) {
        this.ventaService = ventaService;
    }

    @GetMapping
    public ResponseEntity<List<VentaResponseDto>> getVentas() {
        List<VentaResponseDto> ventas = ventaService.getVentas()
                .stream()
                .map(this::convertirAResponseDto)
                .toList();

        return ResponseEntity.ok(ventas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVenta(@PathVariable Integer id) {
        Optional<Venta> venta = ventaService.getVenta(id);

        if (venta.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("La venta con id " + id + " no existe"));
        }

        return ResponseEntity.ok(convertirAResponseDto(venta.get()));
    }

    @GetMapping("/pedido/{pedidoId}")
    public ResponseEntity<?> getVentaPorPedido(@PathVariable Integer pedidoId) {
        Optional<Venta> venta = ventaService.getVentaPorPedido(pedidoId);

        if (venta.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("No existe venta asociada al pedido con id " + pedidoId));
        }

        return ResponseEntity.ok(convertirAResponseDto(venta.get()));
    }

    @GetMapping("/estado/{estadoVenta}")
    public ResponseEntity<List<VentaResponseDto>> getVentasPorEstado(@PathVariable EstadoVenta estadoVenta) {
        List<VentaResponseDto> ventas = ventaService.getVentasPorEstado(estadoVenta)
                .stream()
                .map(this::convertirAResponseDto)
                .toList();

        return ResponseEntity.ok(ventas);
    }

    @PostMapping
    public ResponseEntity<?> createVenta(@Valid @RequestBody CreateVentaDto dto) {
        try {
            Venta venta = ventaService.createVenta(dto);

            return ResponseEntity
                    .status(201)
                    .body(convertirAResponseDto(venta));
        } catch (IllegalArgumentException error) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageDto(error.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVenta(
            @PathVariable Integer id,
            @RequestBody UpdateVentaDto dto
    ) {
        try {
            Optional<Venta> venta = ventaService.updateVenta(id, dto);

            if (venta.isEmpty()) {
                return ResponseEntity
                        .status(404)
                        .body(new MessageDto("La venta con id " + id + " no existe"));
            }

            return ResponseEntity.ok(convertirAResponseDto(venta.get()));
        } catch (IllegalArgumentException error) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageDto(error.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVenta(@PathVariable Integer id) {
        Optional<Venta> venta = ventaService.deleteVenta(id);

        if (venta.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("La venta con id " + id + " no existe"));
        }

        return ResponseEntity.ok(new MessageDto("Venta cancelada correctamente"));
    }

    private VentaResponseDto convertirAResponseDto(Venta venta) {
        return new VentaResponseDto(
                venta.getId(),
                venta.getPedido().getId(),
                venta.getPago() != null ? venta.getPago().getId() : null,
                venta.getPedido().getCliente().getNombre(),
                venta.getFechaVenta(),
                venta.getMontoTotal(),
                venta.getEstadoVenta(),
                venta.getComprobante(),
                venta.getActivo(),
                venta.getCreatedAt(),
                venta.getUpdatedAt()
        );
    }
}