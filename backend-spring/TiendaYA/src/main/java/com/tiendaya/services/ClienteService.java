package com.tiendaya.services;

import com.tiendaya.dtos.CreateClienteDto;
import com.tiendaya.dtos.UpdateClienteDto;
import com.tiendaya.interfaces.IClienteService;
import com.tiendaya.models.Cliente;
import com.tiendaya.repositories.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService implements IClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Override
    public List<Cliente> getClientes() {
        return clienteRepository.findByActivoTrueOrderByIdAsc();
    }

    @Override
    public Optional<Cliente> getCliente(Integer id) {
        return clienteRepository.findById(id);
    }

    @Override
    public Optional<Cliente> getClientePorTelefono(String telefono) {
        return clienteRepository.findByTelefono(telefono);
    }

    @Override
    public Cliente createCliente(CreateClienteDto dto) {
        Cliente cliente = new Cliente();

        cliente.setNombre(dto.nombre());
        cliente.setTelefono(dto.telefono());
        cliente.setDireccion(dto.direccion());
        cliente.setActivo(true);

        return clienteRepository.save(cliente);
    }

    @Override
    public Optional<Cliente> updateCliente(Integer id, UpdateClienteDto dto) {
        Optional<Cliente> clienteBuscado = clienteRepository.findById(id);

        if (clienteBuscado.isEmpty()) {
            return Optional.empty();
        }

        Cliente cliente = clienteBuscado.get();

        if (dto.nombre() != null) {
            cliente.setNombre(dto.nombre());
        }

        if (dto.telefono() != null) {
            cliente.setTelefono(dto.telefono());
        }

        if (dto.direccion() != null) {
            cliente.setDireccion(dto.direccion());
        }

        if (dto.activo() != null) {
            cliente.setActivo(dto.activo());
        }

        Cliente clienteActualizado = clienteRepository.save(cliente);

        return Optional.of(clienteActualizado);
    }

    @Override
    public Optional<Cliente> deleteCliente(Integer id) {
        Optional<Cliente> clienteBuscado = clienteRepository.findById(id);

        if (clienteBuscado.isEmpty()) {
            return Optional.empty();
        }

        Cliente cliente = clienteBuscado.get();
        cliente.setActivo(false);

        Cliente clienteDesactivado = clienteRepository.save(cliente);

        return Optional.of(clienteDesactivado);
    }
}