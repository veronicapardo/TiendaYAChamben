package com.tiendaya.controllers;

import com.tiendaya.dtos.CreatePedidoDto;
import com.tiendaya.dtos.MessageDto;
import com.tiendaya.models.Cliente;
import com.tiendaya.models.Producto;
import com.tiendaya.models.Pedido;
import com.tiendaya.services.ClienteService;
import com.tiendaya.services.ProductoService;
import com.tiendaya.services.PedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:5173")
public class ClienteController {

    private final ClienteService clienteService;
    private final ProductoService productoService;
    private final PedidoService pedidoService;

    public ClienteController(ClienteService clienteService, 
                             ProductoService productoService,
                             PedidoService pedidoService) {
        this.clienteService = clienteService;
        this.productoService = productoService;
        this.pedidoService = pedidoService;
    }

    // ========== PRODUCTOS ==========

    @GetMapping("/productos")
    public ResponseEntity<List<Producto>> getProductos() {
        List<Producto> productos = productoService.getProductos();
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/productos/{id}")
    public ResponseEntity<?> getProducto(@PathVariable Integer id) {
        Optional<Producto> producto = productoService.getProducto(id);
        if (producto.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(new MessageDto("El producto con id " + id + " no existe"));
        }
        return ResponseEntity.ok(producto.get());
    }

    // ========== PEDIDOS ==========

    @GetMapping("/pedidos")
    public ResponseEntity<List<Pedido>> getPedidos() {
        List<Pedido> pedidos = pedidoService.getPedidos();
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/pedidos/{id}")
    public ResponseEntity<?> getPedido(@PathVariable Integer id) {
        Optional<Pedido> pedido = pedidoService.getPedido(id);
        if (pedido.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(new MessageDto("El pedido con id " + id + " no existe"));
        }
        return ResponseEntity.ok(pedido.get());
    }

    @GetMapping("/pedidos/cliente/{clienteId}")
    public ResponseEntity<List<Pedido>> getPedidosPorCliente(@PathVariable Integer clienteId) {
        List<Pedido> pedidos = pedidoService.getPedidosPorCliente(clienteId);
        return ResponseEntity.ok(pedidos);
    }

    @PostMapping("/pedidos")
    public ResponseEntity<?> createPedido(@RequestBody CreatePedidoDto dto) {
        try {
            Pedido pedido = pedidoService.createPedido(dto);
            return ResponseEntity.status(201).body(pedido);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new MessageDto(e.getMessage()));
        }
    }

    // ========== PERFIL ==========

    @GetMapping("/perfil/{id}")
    public ResponseEntity<?> getPerfil(@PathVariable Integer id) {
        Optional<Cliente> cliente = clienteService.getCliente(id);
        if (cliente.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(new MessageDto("El cliente con id " + id + " no existe"));
        }
        return ResponseEntity.ok(cliente.get());
    }
}