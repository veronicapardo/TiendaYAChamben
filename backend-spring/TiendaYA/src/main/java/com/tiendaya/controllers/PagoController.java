package com.tiendaya.controllers;

import com.tiendaya.dtos.CreatePagoDto;
import com.tiendaya.dtos.MessageDto;
import com.tiendaya.dtos.PagoResponseDto;
import com.tiendaya.dtos.UpdatePagoDto;
import com.tiendaya.interfaces.IPagoService;
import com.tiendaya.models.Pago;
import com.tiendaya.models.enums.EstadoPago;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/v1/pagos")
public class PagoController {

    private final IPagoService pagoService;

    public PagoController(IPagoService pagoService) {
        this.pagoService = pagoService;
    }

    @GetMapping
    public ResponseEntity<List<PagoResponseDto>> getPagos() {
        List<PagoResponseDto> pagos = pagoService.getPagos()
                .stream()
                .map(this::convertirAResponseDto)
                .toList();

        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPago(@PathVariable Integer id) {
        Optional<Pago> pago = pagoService.getPago(id);

        if (pago.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El pago con id " + id + " no existe"));
        }

        return ResponseEntity.ok(convertirAResponseDto(pago.get()));
    }

    @GetMapping("/pedido/{pedidoId}")
    public ResponseEntity<?> getPagoPorPedido(@PathVariable Integer pedidoId) {
        Optional<Pago> pago = pagoService.getPagoPorPedido(pedidoId);

        if (pago.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("No existe pago asociado al pedido con id " + pedidoId));
        }

        return ResponseEntity.ok(convertirAResponseDto(pago.get()));
    }

    @GetMapping("/estado/{estadoPago}")
    public ResponseEntity<List<PagoResponseDto>> getPagosPorEstado(@PathVariable EstadoPago estadoPago) {
        List<PagoResponseDto> pagos = pagoService.getPagosPorEstado(estadoPago)
                .stream()
                .map(this::convertirAResponseDto)
                .toList();

        return ResponseEntity.ok(pagos);
    }

    @PostMapping
    public ResponseEntity<?> createPago(@Valid @RequestBody CreatePagoDto dto) {
        try {
            Pago pago = pagoService.createPago(dto);

            return ResponseEntity
                    .status(201)
                    .body(convertirAResponseDto(pago));
        } catch (IllegalArgumentException error) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageDto(error.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePago(
            @PathVariable Integer id,
            @RequestBody UpdatePagoDto dto
    ) {
        Optional<Pago> pago = pagoService.updatePago(id, dto);

        if (pago.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El pago con id " + id + " no existe"));
        }

        return ResponseEntity.ok(convertirAResponseDto(pago.get()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePago(@PathVariable Integer id) {
        Optional<Pago> pago = pagoService.deletePago(id);

        if (pago.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El pago con id " + id + " no existe"));
        }

        return ResponseEntity.ok(new MessageDto("Pago desactivado correctamente"));
    }

    private PagoResponseDto convertirAResponseDto(Pago pago) {
        return new PagoResponseDto(
                pago.getId(),
                pago.getPedido().getId(),
                pago.getPedido().getCliente().getNombre(),
                pago.getMetodo(),
                pago.getMonto(),
                pago.getEstadoPago(),
                pago.getFechaPago(),
                pago.getActivo(),
                pago.getCreatedAt(),
                pago.getUpdatedAt()
        );
    }
}