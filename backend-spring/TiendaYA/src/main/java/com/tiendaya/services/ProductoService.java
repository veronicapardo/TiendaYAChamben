package com.tiendaya.services;

import com.tiendaya.dtos.CreateProductoDto;
import com.tiendaya.dtos.UpdateProductoDto;
import com.tiendaya.interfaces.IProductoService;
import com.tiendaya.models.Producto;
import com.tiendaya.repositories.ProductoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService implements IProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Override
    public List<Producto> getProductos() {
        return productoRepository.findByActivoTrueOrderByIdAsc();
    }

    @Override
    public Optional<Producto> getProducto(Integer id) {
        return productoRepository.findById(id);
    }

    @Override
    public Producto createProducto(CreateProductoDto dto) {
        Producto producto = new Producto();

        producto.setNombre(dto.nombre());
        producto.setCategoria(dto.categoria());
        producto.setPrecio(dto.precio());
        producto.setStock(dto.stock());
        producto.setFechaVencimiento(convertirFecha(dto.fechaVencimiento()));
        producto.setImageUrl(dto.imageUrl());
        producto.setActivo(true);

        return productoRepository.save(producto);
    }

    @Override
    public Optional<Producto> updateProducto(Integer id, UpdateProductoDto dto) {
        Optional<Producto> productoBuscado = productoRepository.findById(id);

        if (productoBuscado.isEmpty()) {
            return Optional.empty();
        }

        Producto producto = productoBuscado.get();

        if (dto.nombre() != null) {
            producto.setNombre(dto.nombre());
        }

        if (dto.categoria() != null) {
            producto.setCategoria(dto.categoria());
        }

        if (dto.precio() != null) {
            producto.setPrecio(dto.precio());
        }

        if (dto.stock() != null) {
            producto.setStock(dto.stock());
        }

        if (dto.fechaVencimiento() != null) {
            producto.setFechaVencimiento(convertirFecha(dto.fechaVencimiento()));
        }

        if (dto.imageUrl() != null) {
            producto.setImageUrl(dto.imageUrl());
        }

        if (dto.activo() != null) {
            producto.setActivo(dto.activo());
        }

        Producto productoActualizado = productoRepository.save(producto);

        return Optional.of(productoActualizado);
    }

    @Override
    public Optional<Producto> deleteProducto(Integer id) {
        Optional<Producto> productoBuscado = productoRepository.findById(id);

        if (productoBuscado.isEmpty()) {
            return Optional.empty();
        }

        Producto producto = productoBuscado.get();
        producto.setActivo(false);

        Producto productoDesactivado = productoRepository.save(producto);

        return Optional.of(productoDesactivado);
    }

    private LocalDateTime convertirFecha(String fecha) {
        if (fecha == null || fecha.isBlank()) {
            return null;
        }

        if (fecha.length() == 10) {
            return LocalDate.parse(fecha).atStartOfDay();
        }

        return LocalDateTime.parse(fecha);
    }
}