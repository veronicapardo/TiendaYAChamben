package com.tiendaya.interfaces;

import com.tiendaya.dtos.CreateProductoDto;
import com.tiendaya.dtos.UpdateProductoDto;
import com.tiendaya.models.Producto;

import java.util.List;
import java.util.Optional;

public interface IProductoService {

    List<Producto> getProductos();

    Optional<Producto> getProducto(Integer id);

    Producto createProducto(CreateProductoDto dto);

    Optional<Producto> updateProducto(Integer id, UpdateProductoDto dto);

    Optional<Producto> deleteProducto(Integer id);
}