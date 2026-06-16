package com.tiendaya.interfaces;

import com.tiendaya.dtos.CreateProveedorDto;
import com.tiendaya.dtos.UpdateProveedorDto;
import com.tiendaya.models.Proveedor;

import java.util.List;
import java.util.Optional;

public interface IProveedorService {

    List<Proveedor> getProveedores();

    Optional<Proveedor> getProveedor(Integer id);

    Proveedor createProveedor(CreateProveedorDto dto);

    Optional<Proveedor> updateProveedor(Integer id, UpdateProveedorDto dto);

    Optional<Proveedor> deleteProveedor(Integer id);
}