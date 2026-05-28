package com.tiendaya.controllers;

import com.tiendaya.dtos.FacturaResponseDto;
import com.tiendaya.dtos.MessageDto;
import com.tiendaya.models.Factura;
import com.tiendaya.repositories.FacturaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/facturas")
public class FacturaController {

    private final FacturaRepository facturaRepository;

    public FacturaController(FacturaRepository facturaRepository) {
        this.facturaRepository = facturaRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFactura(@PathVariable Integer id) {
        return facturaRepository.findById(id)
                .<ResponseEntity<?>>map(factura -> ResponseEntity.ok(convertirADto(factura)))
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(new MessageDto("La factura con id " + id + " no existe")));
    }

    @GetMapping("/venta/{ventaId}")
    public ResponseEntity<?> getFacturaPorVenta(@PathVariable Integer ventaId) {
        return facturaRepository.findByVentaId(ventaId)
                .<ResponseEntity<?>>map(factura -> ResponseEntity.ok(convertirADto(factura)))
                .orElseGet(() -> ResponseEntity.status(404)
                        .body(new MessageDto("La venta con id " + ventaId + " no tiene factura")));
    }

    private FacturaResponseDto convertirADto(Factura factura) {
        return new FacturaResponseDto(
                factura.getId(),
                factura.getVenta().getId(),
                factura.getNitCi(),
                factura.getRazonSocial(),
                factura.getFechaEmision(),
                factura.getTotal(),
                factura.getMetodoPago(),
                factura.getEstadoFactura()
        );
    }
}