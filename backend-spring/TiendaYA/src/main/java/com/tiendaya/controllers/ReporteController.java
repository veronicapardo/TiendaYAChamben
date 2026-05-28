package com.tiendaya.controllers;

import com.tiendaya.dtos.ReporteGeneralResponseDto;
import com.tiendaya.services.ReporteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/v1/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @GetMapping
    public ResponseEntity<ReporteGeneralResponseDto> obtenerReporte(
            @RequestParam(required = false) LocalDate desde,
            @RequestParam(required = false) LocalDate hasta,
            @RequestParam(required = false, defaultValue = "TODOS") String metodo,
            @RequestParam(required = false, defaultValue = "TODOS") String estado
    ) {
        LocalDate hoy = LocalDate.now();

        LocalDate fechaDesde = desde != null ? desde : hoy.minusDays(7);
        LocalDate fechaHasta = hasta != null ? hasta : hoy;

        return ResponseEntity.ok(
                reporteService.obtenerReporte(fechaDesde, fechaHasta, metodo, estado)
        );
    }
}