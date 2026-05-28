package com.tiendaya.services;

import com.tiendaya.dtos.CreateProveedorDto;
import com.tiendaya.dtos.UpdateProveedorDto;
import com.tiendaya.interfaces.IProveedorService;
import com.tiendaya.models.Proveedor;
import com.tiendaya.repositories.ProveedorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProveedorService implements IProveedorService {

    private final ProveedorRepository proveedorRepository;

    public ProveedorService(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    @Override
    public List<Proveedor> getProveedores() {
        return proveedorRepository.findByActivoTrueOrderByIdAsc();
    }

    @Override
    public Optional<Proveedor> getProveedor(Integer id) {
        return proveedorRepository.findById(id);
    }

    @Override
    public Proveedor createProveedor(CreateProveedorDto dto) {
        Proveedor proveedor = new Proveedor();
        proveedor.setNombre(dto.nombre());
        proveedor.setContactoNombre(dto.contactoNombre());
        proveedor.setTelefono(dto.telefono());
        proveedor.setEmail(dto.email());
        proveedor.setActivo(true);
        return proveedorRepository.save(proveedor);
    }

    @Override
    public Optional<Proveedor> updateProveedor(Integer id, UpdateProveedorDto dto) {
        Optional<Proveedor> proveedorBuscado = proveedorRepository.findById(id);

        if (proveedorBuscado.isEmpty()) {
            return Optional.empty();
        }

        Proveedor proveedor = proveedorBuscado.get();

        if (dto.nombre() != null) {
            proveedor.setNombre(dto.nombre());
        }
        if (dto.contactoNombre() != null) {
            proveedor.setContactoNombre(dto.contactoNombre());
        }
        if (dto.telefono() != null) {
            proveedor.setTelefono(dto.telefono());
        }
        if (dto.email() != null) {
            proveedor.setEmail(dto.email());
        }
        if (dto.activo() != null) {
            proveedor.setActivo(dto.activo());
        }

        return Optional.of(proveedorRepository.save(proveedor));
    }

    @Override
    public Optional<Proveedor> deleteProveedor(Integer id) {
        Optional<Proveedor> proveedorBuscado = proveedorRepository.findById(id);

        if (proveedorBuscado.isEmpty()) {
            return Optional.empty();
        }

        Proveedor proveedor = proveedorBuscado.get();
        proveedor.setActivo(false);

        return Optional.of(proveedorRepository.save(proveedor));
    }
}