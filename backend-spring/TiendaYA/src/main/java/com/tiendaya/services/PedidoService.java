package com.tiendaya.services;

import com.tiendaya.dtos.CreatePedidoDto;
import com.tiendaya.dtos.PedidoProductoDto;
import com.tiendaya.dtos.UpdatePedidoDto;
import com.tiendaya.interfaces.IPedidoService;
import com.tiendaya.models.*;
import com.tiendaya.models.enums.EstadoPedido;
import com.tiendaya.repositories.ClienteRepository;
import com.tiendaya.repositories.PedidoRepository;
import com.tiendaya.repositories.ProductoRepository;
import com.tiendaya.repositories.RepartidorRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import com.tiendaya.dtos.CreatePedidoRapidoDto;
import com.tiendaya.dtos.PedidoProductoDto;
import com.tiendaya.models.Cliente;
import com.tiendaya.models.Pedido;
import com.tiendaya.models.PedidoDetalle;
import com.tiendaya.models.Producto;
import com.tiendaya.models.Repartidor;
import com.tiendaya.models.enums.EstadoPedido;
import java.math.BigDecimal;


import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoService implements IPedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;
    private final RepartidorRepository repartidorRepository;

    public PedidoService(
            PedidoRepository pedidoRepository,
            ClienteRepository clienteRepository,
            ProductoRepository productoRepository,
            RepartidorRepository repartidorRepository
    ) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.productoRepository = productoRepository;
        this.repartidorRepository = repartidorRepository;
    }

    @Override
    public List<Pedido> getPedidos() {
        return pedidoRepository.findAllByOrderByIdAsc();
    }

    @Override
    public Optional<Pedido> getPedido(Integer id) {
        return pedidoRepository.findById(id);
    }

    @Override
    public List<Pedido> getPedidosPorCliente(Integer clienteId) {
        return pedidoRepository.findByClienteIdOrderByIdAsc(clienteId);
    }

    @Override
    public List<Pedido> getPedidosPorEstado(EstadoPedido estado) {
        return pedidoRepository.findByEstadoOrderByIdAsc(estado);
    }


    public List<Pedido> getPedidosPorRepartidor(Integer repartidorId) {
        return pedidoRepository.findAll()
                .stream()
                .filter(pedido -> pedido.getEstado() != EstadoPedido.CANCELADO)
                .filter(pedido ->
                        pedido.getRepartidor() == null ||
                                pedido.getRepartidor().getId().equals(repartidorId)
                )
                .toList();
    }

    public List<Pedido> getHistorialPorRepartidor(Integer repartidorId) {
        return pedidoRepository.findAll()
                .stream()
                .filter(pedido -> pedido.getRepartidor() != null)
                .filter(pedido -> pedido.getRepartidor().getId().equals(repartidorId))
                .filter(pedido ->
                        pedido.getEstado() == EstadoPedido.ENTREGADO ||
                                pedido.getEstado() == EstadoPedido.CANCELADO ||
                                pedido.getEstado() == EstadoPedido.ENTREGA_FALLIDA
                )
                .toList();
    }
    @Override
    @Transactional
    public Pedido createPedido(CreatePedidoDto dto) {
        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new IllegalArgumentException("El cliente con id " + dto.clienteId() + " no existe"));

        if (!cliente.getActivo()) {
            throw new IllegalArgumentException("El cliente seleccionado está desactivado");
        }

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDireccionEntrega(dto.direccionEntrega());
        pedido.setEstado(EstadoPedido.PENDIENTE);

        if (dto.repartidorId() != null) {
            Repartidor repartidor = obtenerRepartidorValido(dto.repartidorId());
            pedido.setRepartidor(repartidor);
        }

        BigDecimal total = BigDecimal.ZERO;

        for (PedidoProductoDto item : dto.productos()) {
            Producto producto = productoRepository.findById(item.productoId())
                    .orElseThrow(() -> new IllegalArgumentException("El producto con id " + item.productoId() + " no existe"));

            if (!producto.getActivo()) {
                throw new IllegalArgumentException("El producto " + producto.getNombre() + " está desactivado");
            }

            if (producto.getStock() < item.cantidad()) {
                throw new IllegalArgumentException("Stock insuficiente para el producto " + producto.getNombre());
            }

            BigDecimal precioUnitario = producto.getPrecio();
            BigDecimal cantidad = BigDecimal.valueOf(item.cantidad());
            BigDecimal subtotal = precioUnitario.multiply(cantidad);

            producto.setStock(producto.getStock() - item.cantidad());
            productoRepository.save(producto);

            PedidoDetalle detalle = new PedidoDetalle();
            detalle.setProducto(producto);
            detalle.setCantidad(item.cantidad());
            detalle.setPrecioUnitario(precioUnitario);
            detalle.setSubtotal(subtotal);

            pedido.agregarDetalle(detalle);

            total = total.add(subtotal);
        }

        pedido.setTotal(total);

        return pedidoRepository.save(pedido);
    }

    @Override
    @Transactional
    public Pedido createPedidoRapido(CreatePedidoRapidoDto dto) {
        Cliente cliente = obtenerOcrearClientePorTelefono(dto);

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDireccionEntrega(dto.direccionEntrega());
        pedido.setEstado(EstadoPedido.PENDIENTE);

        if (dto.repartidorId() != null) {
            Repartidor repartidor = repartidorRepository.findById(dto.repartidorId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "El repartidor con id " + dto.repartidorId() + " no existe"
                    ));

            pedido.setRepartidor(repartidor);
        }

        BigDecimal totalProductos = BigDecimal.ZERO;

        for (PedidoProductoDto item : dto.productos()) {
            Producto producto = productoRepository.findById(item.productoId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "El producto con id " + item.productoId() + " no existe"
                    ));

            if (!Boolean.TRUE.equals(producto.getActivo())) {
                throw new IllegalArgumentException("El producto " + producto.getNombre() + " está desactivado");
            }

            if (item.cantidad() <= 0) {
                throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
            }

            if (producto.getStock() < item.cantidad()) {
                throw new IllegalArgumentException("Stock insuficiente para " + producto.getNombre());
            }

            BigDecimal subtotal = producto.getPrecio().multiply(BigDecimal.valueOf(item.cantidad()));

            PedidoDetalle detalle = new PedidoDetalle();
            detalle.setProducto(producto);
            detalle.setCantidad(item.cantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setSubtotal(subtotal);

            pedido.agregarDetalle(detalle);

            producto.setStock(producto.getStock() - item.cantidad());
            productoRepository.save(producto);

            totalProductos = totalProductos.add(subtotal);
        }

        BigDecimal costoEnvio = dto.costoEnvio() != null ? dto.costoEnvio() : BigDecimal.ZERO;

        if (costoEnvio.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("El costo de envío no puede ser negativo");
        }

        BigDecimal totalFinal = totalProductos.add(costoEnvio);
        pedido.setTotal(totalFinal);

        return pedidoRepository.save(pedido);
    }

    private Cliente obtenerOcrearClientePorTelefono(CreatePedidoRapidoDto dto) {
        return clienteRepository.findByTelefono(dto.clienteTelefono())
                .map(clienteExistente -> {
                    clienteExistente.setNombre(dto.clienteNombre());
                    clienteExistente.setDireccion(dto.direccionEntrega());
                    clienteExistente.setActivo(true);
                    return clienteRepository.save(clienteExistente);
                })
                .orElseGet(() -> {
                    Cliente cliente = new Cliente();
                    cliente.setNombre(dto.clienteNombre());
                    cliente.setTelefono(dto.clienteTelefono());
                    cliente.setDireccion(dto.direccionEntrega());
                    cliente.setActivo(true);

                    return clienteRepository.save(cliente);
                });
    }

    @Override
    @Transactional
    public Optional<Pedido> updatePedido(Integer id, UpdatePedidoDto dto) {
        Optional<Pedido> pedidoBuscado = pedidoRepository.findById(id);

        if (pedidoBuscado.isEmpty()) {
            return Optional.empty();
        }

        Pedido pedido = pedidoBuscado.get();

        if (dto.direccionEntrega() != null) {
            pedido.setDireccionEntrega(dto.direccionEntrega());
        }

        if (dto.repartidorId() != null) {
            Repartidor repartidor = obtenerRepartidorValido(dto.repartidorId());
            pedido.setRepartidor(repartidor);
        }

        if (dto.estado() != null) {
            if (dto.estado() == EstadoPedido.CANCELADO && pedido.getEstado() != EstadoPedido.CANCELADO) {
                restaurarStockDelPedido(pedido);
            }

            pedido.setEstado(dto.estado());
        }

        return Optional.of(pedidoRepository.save(pedido));
    }

    @Override
    @Transactional
    public Optional<Pedido> deletePedido(Integer id) {
        Optional<Pedido> pedidoBuscado = pedidoRepository.findById(id);

        if (pedidoBuscado.isEmpty()) {
            return Optional.empty();
        }

        Pedido pedido = pedidoBuscado.get();

        if (pedido.getEstado() != EstadoPedido.CANCELADO) {
            restaurarStockDelPedido(pedido);
        }

        pedido.setEstado(EstadoPedido.CANCELADO);

        return Optional.of(pedidoRepository.save(pedido));
    }

    private Repartidor obtenerRepartidorValido(Integer repartidorId) {
        Repartidor repartidor = repartidorRepository.findById(repartidorId)
                .orElseThrow(() -> new IllegalArgumentException("El repartidor con id " + repartidorId + " no existe"));

        if (!repartidor.getActivo()) {
            throw new IllegalArgumentException("El repartidor seleccionado está desactivado");
        }

        return repartidor;
    }

    private void restaurarStockDelPedido(Pedido pedido) {
        for (PedidoDetalle detalle : pedido.getDetalles()) {
            Producto producto = detalle.getProducto();
            producto.setStock(producto.getStock() + detalle.getCantidad());
            productoRepository.save(producto);
        }
    }
}