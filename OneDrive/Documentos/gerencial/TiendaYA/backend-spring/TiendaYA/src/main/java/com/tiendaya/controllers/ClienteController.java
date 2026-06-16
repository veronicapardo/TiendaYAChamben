package com.tiendaya.controllers;

import com.tiendaya.dtos.CreateClienteDto;
import com.tiendaya.dtos.MessageDto;
import com.tiendaya.dtos.UpdateClienteDto;
import com.tiendaya.interfaces.IClienteService;
import com.tiendaya.models.Cliente;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/v1/clientes")
public class ClienteController {

    private final IClienteService clienteService;

    public ClienteController(IClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> getClientes() {
        List<Cliente> clientes = clienteService.getClientes();

        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCliente(@PathVariable Integer id) {
        Optional<Cliente> cliente = clienteService.getCliente(id);

        if (cliente.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El cliente con id " + id + " no existe"));
        }

        return ResponseEntity.ok(cliente.get());
    }

    @GetMapping("/telefono/{telefono}")
    public ResponseEntity<?> getClientePorTelefono(@PathVariable String telefono) {
        Optional<Cliente> cliente = clienteService.getClientePorTelefono(telefono);

        if (cliente.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El cliente con teléfono " + telefono + " no existe"));
        }

        return ResponseEntity.ok(cliente.get());
    }

    @PostMapping
    public ResponseEntity<Cliente> createCliente(@Valid @RequestBody CreateClienteDto dto) {
        Cliente cliente = clienteService.createCliente(dto);

        return ResponseEntity.status(201).body(cliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCliente(
            @PathVariable Integer id,
            @RequestBody UpdateClienteDto dto
    ) {
        Optional<Cliente> cliente = clienteService.updateCliente(id, dto);

        if (cliente.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El cliente con id " + id + " no existe"));
        }

        return ResponseEntity.ok(cliente.get());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCliente(@PathVariable Integer id) {
        Optional<Cliente> cliente = clienteService.deleteCliente(id);

        if (cliente.isEmpty()) {
            return ResponseEntity
                    .status(404)
                    .body(new MessageDto("El cliente con id " + id + " no existe"));
        }

        return ResponseEntity.ok(new MessageDto("Cliente desactivado correctamente"));
    }
}