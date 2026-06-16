package com.tiendaya.controllers;

import com.tiendaya.dtos.CajeroDashboardDto;
import com.tiendaya.interfaces.ICajeroDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/cajero")
public class CajeroDashboardController {

    private final ICajeroDashboardService cajeroDashboardService;

    public CajeroDashboardController(ICajeroDashboardService cajeroDashboardService) {
        this.cajeroDashboardService = cajeroDashboardService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<CajeroDashboardDto> obtenerDashboard() {
        CajeroDashboardDto dashboard = cajeroDashboardService.obtenerDashboard();
        return ResponseEntity.ok(dashboard);
    }
}