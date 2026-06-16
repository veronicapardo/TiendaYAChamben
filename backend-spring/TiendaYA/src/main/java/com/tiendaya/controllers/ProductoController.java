package com.tiendaya.controllers;

import com.tiendaya.dtos.CreateProductoDto;
import com.tiendaya.dtos.MessageDto;
import com.tiendaya.dtos.UpdateProductoDto;
import com.tiendaya.models.Producto;
import com.tiendaya.interfaces.IProductoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/v1/productos")
public class ProductoController {

    private final IProductoService productoService;

    public ProductoController(IProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public ResponseEntity<List<Producto>> getProductos() {
        List<Producto> productos = productoService.getProductos();

        return ResponseEntity.ok(productos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProducto(@PathVariable Integer id) {
        Optional<Producto> producto = productoService.getProducto(id);

        if (producto.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El producto con id " + id + " no existe"));
        }

        return ResponseEntity.ok(producto.get());
    }

    @PostMapping
    public ResponseEntity<Producto> createProducto(@Valid @RequestBody CreateProductoDto dto) {
        Producto producto = productoService.createProducto(dto);

        return ResponseEntity.status(201).body(producto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProducto(
            @PathVariable Integer id,
            @RequestBody UpdateProductoDto dto
    ) {
        Optional<Producto> producto = productoService.updateProducto(id, dto);

        if (producto.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El producto con id " + id + " no existe"));
        }

        return ResponseEntity.ok(producto.get());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProducto(@PathVariable Integer id) {
        Optional<Producto> producto = productoService.deleteProducto(id);

        if (producto.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El producto con id " + id + " no existe"));
        }

        return ResponseEntity.ok(new MessageDto("Producto desactivado correctamente"));
    }
}