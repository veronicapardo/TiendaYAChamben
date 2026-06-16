package com.tiendaya.interfaces;

import com.tiendaya.dtos.CreateClienteDto;
import com.tiendaya.dtos.UpdateClienteDto;
import com.tiendaya.models.Cliente;

import java.util.List;
import java.util.Optional;

public interface IClienteService {

    List<Cliente> getClientes();

    Optional<Cliente> getCliente(Integer id);

    Optional<Cliente> getClientePorTelefono(String telefono);

    Cliente createCliente(CreateClienteDto dto);

    Optional<Cliente> updateCliente(Integer id, UpdateClienteDto dto);

    Optional<Cliente> deleteCliente(Integer id);
}