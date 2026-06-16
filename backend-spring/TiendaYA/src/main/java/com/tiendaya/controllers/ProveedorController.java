package com.tiendaya.controllers;

import com.tiendaya.dtos.CreateProveedorDto;
import com.tiendaya.dtos.MessageDto;
import com.tiendaya.dtos.UpdateProveedorDto;
import com.tiendaya.interfaces.IProveedorService;
import com.tiendaya.models.Proveedor;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/v1/proveedores")
public class ProveedorController {

    private final IProveedorService proveedorService;

    public ProveedorController(IProveedorService proveedorService) {
        this.proveedorService = proveedorService;
    }

    @GetMapping
    public ResponseEntity<List<Proveedor>> getProveedores() {
        List<Proveedor> proveedores = proveedorService.getProveedores();
        return ResponseEntity.ok(proveedores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProveedor(@PathVariable Integer id) {
        Optional<Proveedor> proveedor = proveedorService.getProveedor(id);

        if (proveedor.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El proveedor con id " + id + " no existe"));
        }

        return ResponseEntity.ok(proveedor.get());
    }

    @PostMapping
    public ResponseEntity<Proveedor> createProveedor(@Valid @RequestBody CreateProveedorDto dto) {
        Proveedor proveedor = proveedorService.createProveedor(dto);
        return ResponseEntity.status(201).body(proveedor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProveedor(
            @PathVariable Integer id,
            @RequestBody UpdateProveedorDto dto
    ) {
        Optional<Proveedor> proveedor = proveedorService.updateProveedor(id, dto);

        if (proveedor.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El proveedor con id " + id + " no existe"));
        }

        return ResponseEntity.ok(proveedor.get());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProveedor(@PathVariable Integer id) {
        Optional<Proveedor> proveedor = proveedorService.deleteProveedor(id);

        if (proveedor.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El proveedor con id " + id + " no existe"));
        }

        return ResponseEntity.ok(new MessageDto("Proveedor desactivado correctamente"));
    }
}