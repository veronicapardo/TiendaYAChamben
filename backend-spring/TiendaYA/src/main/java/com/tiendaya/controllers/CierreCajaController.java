package com.tiendaya.controllers;

import com.tiendaya.dtos.CierreCajaResponseDto;
import com.tiendaya.services.CierreCajaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tiendaya.dtos.CreateCierreCajaDto;
import com.tiendaya.dtos.MessageDto;
import com.tiendaya.models.CierreCaja;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/v1/cierre-caja")
@CrossOrigin(origins = "*")
public class CierreCajaController {

    private final CierreCajaService cierreCajaService;

    public CierreCajaController(CierreCajaService cierreCajaService) {
        this.cierreCajaService = cierreCajaService;
    }

    @GetMapping
    public ResponseEntity<CierreCajaResponseDto> obtenerCierreDelDia() {
        return ResponseEntity.ok(cierreCajaService.obtenerCierreDelDia());
    }

    @PostMapping
    public ResponseEntity<?> cerrarCaja(@Valid @RequestBody CreateCierreCajaDto dto) {
        try {
            CierreCaja cierreCaja = cierreCajaService.cerrarCaja(dto);

            return ResponseEntity
                    .status(201)
                    .body(cierreCaja);
        } catch (IllegalArgumentException error) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageDto(error.getMessage()));
        }
    }
}