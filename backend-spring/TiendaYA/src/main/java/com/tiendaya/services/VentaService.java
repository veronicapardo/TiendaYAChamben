package com.tiendaya.services;

import com.tiendaya.dtos.CreateVentaDto;
import com.tiendaya.dtos.UpdateVentaDto;
import com.tiendaya.interfaces.IVentaService;
import com.tiendaya.models.Pago;
import com.tiendaya.models.Pedido;
import com.tiendaya.models.PedidoDetalle;
import com.tiendaya.models.Producto;
import com.tiendaya.models.Venta;
import com.tiendaya.models.enums.EstadoPago;
import com.tiendaya.models.enums.EstadoPedido;
import com.tiendaya.models.enums.EstadoVenta;
import com.tiendaya.repositories.PagoRepository;
import com.tiendaya.repositories.PedidoRepository;
import com.tiendaya.repositories.VentaRepository;
import com.tiendaya.repositories.ProductoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.tiendaya.dtos.ConvertirPedidoVentaDto;

import com.tiendaya.models.Factura;
import com.tiendaya.models.enums.EstadoFactura;
import com.tiendaya.repositories.FacturaRepository;

import com.tiendaya.dtos.CreateVentaRapidaDto;
import com.tiendaya.dtos.PedidoProductoDto;
import com.tiendaya.models.Cliente;
import com.tiendaya.repositories.ClienteRepository;
import java.math.BigDecimal;
import com.tiendaya.models.enums.MetodoPago;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VentaService implements IVentaService {

    private final VentaRepository ventaRepository;
    private final PedidoRepository pedidoRepository;
    private final PagoRepository pagoRepository;
    private final ProductoRepository productoRepository;
    private final ClienteRepository clienteRepository;
    private final FacturaRepository facturaRepository;

    public VentaService(
            VentaRepository ventaRepository,
            PedidoRepository pedidoRepository,
            PagoRepository pagoRepository,
            ProductoRepository productoRepository,
            ClienteRepository clienteRepository,
            FacturaRepository facturaRepository
    ) {
        this.ventaRepository = ventaRepository;
        this.pedidoRepository = pedidoRepository;
        this.pagoRepository = pagoRepository;
        this.productoRepository = productoRepository;
        this.clienteRepository = clienteRepository;
        this.facturaRepository = facturaRepository;
    }

    @Override
    public List<Venta> getVentas() {
        return ventaRepository.findByActivoTrueOrderByIdAsc();
    }

    @Override
    public Optional<Venta> getVenta(Integer id) {
        return ventaRepository.findById(id);
    }

    @Override
    public Optional<Venta> getVentaPorPedido(Integer pedidoId) {
        return ventaRepository.findByPedidoId(pedidoId);
    }

    @Override
    public List<Venta> getVentasPorEstado(EstadoVenta estadoVenta) {
        return ventaRepository.findByEstadoVentaOrderByIdAsc(estadoVenta);
    }

    @Override
    @Transactional
    public Venta createVenta(CreateVentaDto dto) {
        Pedido pedido = pedidoRepository.findById(dto.pedidoId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "El pedido con id " + dto.pedidoId() + " no existe"
                ));

        if (pedido.getEstado() == EstadoPedido.CANCELADO) {
            throw new IllegalArgumentException("No se puede registrar venta para un pedido cancelado");
        }

        if (ventaRepository.existsByPedidoId(dto.pedidoId())) {
            throw new IllegalArgumentException("Este pedido ya tiene una venta registrada");
        }

        if (dto.pagoId() == null) {
            throw new IllegalArgumentException("Para registrar una venta se necesita un pago confirmado");
        }

        Pago pago = obtenerPagoValido(dto.pagoId(), pedido.getId());

        if (ventaRepository.existsByPagoId(dto.pagoId())) {
            throw new IllegalArgumentException("Este pago ya está asociado a una venta");
        }

        if (pago.getMonto().compareTo(pedido.getTotal()) != 0) {
            throw new IllegalArgumentException("El monto del pago no coincide con el total del pedido");
        }

        Venta venta = new Venta();

        venta.setPedido(pedido);
        venta.setPago(pago);

        // La venta toma el total real del pedido.
        venta.setMontoTotal(pedido.getTotal());

        // La venta toma el método real del pago.
        venta.setMetodoPago(pago.getMetodo());

        if (pago.getMetodo() == MetodoPago.EFECTIVO) {
            venta.setMontoEfectivo(pedido.getTotal());
            venta.setMontoDigital(BigDecimal.ZERO);
            venta.setCambio(BigDecimal.ZERO);
        }

        if (pago.getMetodo() == MetodoPago.QR || pago.getMetodo() == MetodoPago.TRANSFERENCIA) {
            venta.setMontoEfectivo(BigDecimal.ZERO);
            venta.setMontoDigital(pedido.getTotal());
            venta.setCambio(BigDecimal.ZERO);
        }

        if (pago.getMetodo() == MetodoPago.MIXTO) {
            venta.setMontoEfectivo(BigDecimal.ZERO);
            venta.setMontoDigital(BigDecimal.ZERO);
            venta.setCambio(BigDecimal.ZERO);
        }

        // Si hay pago confirmado, la venta ya queda completada.
        venta.setEstadoVenta(EstadoVenta.COMPLETADA);

        venta.setComprobante(dto.comprobante());
        venta.setActivo(true);

        // Como la venta ya fue completada, el pedido deja de estar pendiente.
        pedido.setEstado(EstadoPedido.ENTREGADO);
        pedidoRepository.save(pedido);

        return ventaRepository.save(venta);
    }

    @Override
    @Transactional
    public Venta createVentaRapida(CreateVentaRapidaDto dto) {
        Cliente cliente = obtenerOcrearClienteVentaRapida(dto);

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDireccionEntrega("Venta en tienda");
        pedido.setEstado(EstadoPedido.ENTREGADO);

        BigDecimal total = BigDecimal.ZERO;

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
                throw new IllegalArgumentException(
                        "Stock insuficiente para " + producto.getNombre()
                );
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

            total = total.add(subtotal);
        }

        BigDecimal costoEnvio = dto.costoEnvio() != null ? dto.costoEnvio() : BigDecimal.ZERO;

        if (costoEnvio.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("El costo de envío no puede ser negativo");
        }

        BigDecimal totalFinal = total.add(costoEnvio);

        pedido.setTotal(totalFinal);
        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        validarPagoVentaRapida(dto, totalFinal);

        Pago pago = new Pago();
        pago.setPedido(pedidoGuardado);
        pago.setMetodo(dto.metodoPago());
        pago.setMonto(totalFinal);
        pago.setEstadoPago(EstadoPago.CONFIRMADO);
        pago.setFechaPago(java.time.LocalDateTime.now());
        pago.setActivo(true);

        Pago pagoGuardado = pagoRepository.save(pago);

        Venta venta = new Venta();
        venta.setPedido(pedidoGuardado);
        venta.setPago(pagoGuardado);
        venta.setMontoTotal(totalFinal);
        venta.setMetodoPago(dto.metodoPago());
        venta.setEstadoVenta(EstadoVenta.COMPLETADA);
        venta.setComprobante(generarComprobanteVentaRapida(dto));
        venta.setActivo(true);

        BigDecimal montoEfectivo = BigDecimal.ZERO;
        BigDecimal montoDigital = BigDecimal.ZERO;
        BigDecimal cambio = BigDecimal.ZERO;

        if (dto.metodoPago() == MetodoPago.EFECTIVO) {
            BigDecimal recibido = dto.montoRecibido() != null ? dto.montoRecibido() : BigDecimal.ZERO;

            montoEfectivo = totalFinal;
            cambio = recibido.subtract(totalFinal);

            if (cambio.compareTo(BigDecimal.ZERO) < 0) {
                cambio = BigDecimal.ZERO;
            }
        }

        if (dto.metodoPago() == MetodoPago.QR || dto.metodoPago() == MetodoPago.TRANSFERENCIA) {
            montoDigital = totalFinal;
        }

        if (dto.metodoPago() == MetodoPago.MIXTO) {
            BigDecimal efectivoRecibido = dto.montoEfectivo() != null ? dto.montoEfectivo() : BigDecimal.ZERO;
            BigDecimal digitalRecibido = dto.montoDigital() != null ? dto.montoDigital() : BigDecimal.ZERO;

            montoDigital = digitalRecibido;

            BigDecimal efectivoNecesario = totalFinal.subtract(montoDigital);

            if (efectivoNecesario.compareTo(BigDecimal.ZERO) < 0) {
                efectivoNecesario = BigDecimal.ZERO;
            }

            montoEfectivo = efectivoNecesario;

            BigDecimal totalRecibido = efectivoRecibido.add(digitalRecibido);
            cambio = totalRecibido.subtract(totalFinal);

            if (cambio.compareTo(BigDecimal.ZERO) < 0) {
                cambio = BigDecimal.ZERO;
            }
        }

        venta.setMontoEfectivo(montoEfectivo);
        venta.setMontoDigital(montoDigital);
        venta.setCambio(cambio);

        Venta ventaGuardada = ventaRepository.save(venta);

        generarFacturaSiCorresponde(dto, ventaGuardada);

        return ventaGuardada;
    }

    private Cliente obtenerOcrearClienteVentaRapida(CreateVentaRapidaDto dto) {
        if (dto.clienteId() != null) {
            return clienteRepository.findById(dto.clienteId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "El cliente con id " + dto.clienteId() + " no existe"
                    ));
        }

        String telefonoCaja = "00000000";

        Optional<Cliente> clienteCajaExistente = clienteRepository.findByTelefono(telefonoCaja);

        if (clienteCajaExistente.isPresent()) {
            return clienteCajaExistente.get();
        }

        Cliente cliente = new Cliente();
        cliente.setNombre("Cliente caja");
        cliente.setTelefono(telefonoCaja);
        cliente.setDireccion("Venta en tienda");
        cliente.setActivo(true);

        return clienteRepository.save(cliente);
    }

    private void validarPagoVentaRapida(CreateVentaRapidaDto dto, BigDecimal total) {
        if (dto.metodoPago() == MetodoPago.EFECTIVO) {
            if (dto.montoRecibido() == null || dto.montoRecibido().compareTo(total) < 0) {
                throw new IllegalArgumentException("El monto recibido no cubre el total de la venta");
            }
        }

        if (dto.metodoPago() == MetodoPago.QR || dto.metodoPago() == MetodoPago.TRANSFERENCIA) {
            if (dto.referenciaPago() == null || dto.referenciaPago().isBlank()) {
                throw new IllegalArgumentException("La referencia del pago digital es obligatoria");
            }
        }

        if (dto.metodoPago() == MetodoPago.MIXTO) {
            BigDecimal efectivo = dto.montoEfectivo() != null ? dto.montoEfectivo() : BigDecimal.ZERO;
            BigDecimal digital = dto.montoDigital() != null ? dto.montoDigital() : BigDecimal.ZERO;

            if (efectivo.add(digital).compareTo(total) < 0) {
                throw new IllegalArgumentException("El pago mixto no cubre el total de la venta");
            }
        }

        if (Boolean.TRUE.equals(dto.generarFactura())) {
            if (dto.nitCi() == null || dto.nitCi().isBlank()) {
                throw new IllegalArgumentException("El NIT/CI es obligatorio para generar factura");
            }

            if (dto.razonSocial() == null || dto.razonSocial().isBlank()) {
                throw new IllegalArgumentException("La razón social es obligatoria para generar factura");
            }
        }
    }

    private String generarComprobanteVentaRapida(CreateVentaRapidaDto dto) {
        BigDecimal costoEnvio = dto.costoEnvio() != null ? dto.costoEnvio() : BigDecimal.ZERO;

        if (Boolean.TRUE.equals(dto.generarFactura())) {
            return "FACTURA | NIT/CI: " + dto.nitCi()
                    + " | RAZON SOCIAL: " + dto.razonSocial()
                    + " | ENVIO: " + costoEnvio
                    + " | OBS: " + (dto.observaciones() != null ? dto.observaciones() : "");
        }

        return "TICKET SIMPLE | ENVIO: " + costoEnvio
                + " | OBS: " + (dto.observaciones() != null ? dto.observaciones() : "");
    }

    private void generarFacturaSiCorresponde(CreateVentaRapidaDto dto, Venta ventaGuardada) {
        if (!Boolean.TRUE.equals(dto.generarFactura())) {
            return;
        }

        if (facturaRepository.existsByVentaId(ventaGuardada.getId())) {
            return;
        }

        Factura factura = new Factura();
        factura.setVenta(ventaGuardada);
        factura.setNitCi(dto.nitCi());
        factura.setRazonSocial(dto.razonSocial());
        factura.setTotal(ventaGuardada.getMontoTotal());
        factura.setMetodoPago(ventaGuardada.getMetodoPago());
        factura.setEstadoFactura(EstadoFactura.EMITIDA);
        factura.setActivo(true);

        facturaRepository.save(factura);
    }

    @Override
    @Transactional
    public Venta convertirPedidoEnVenta(Integer pedidoId, ConvertirPedidoVentaDto dto) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "El pedido con id " + pedidoId + " no existe"
                ));

        if (pedido.getEstado() == EstadoPedido.CANCELADO) {
            throw new IllegalArgumentException("No se puede convertir un pedido cancelado en venta");
        }

        if (pedido.getEstado() == EstadoPedido.ENTREGADO) {
            throw new IllegalArgumentException("Este pedido ya fue convertido en venta");
        }

        BigDecimal total = pedido.getTotal() != null ? pedido.getTotal() : BigDecimal.ZERO;

        validarPagoPedidoConvertido(dto, total);

        Pago pago = new Pago();
        pago.setPedido(pedido);
        pago.setMetodo(dto.metodoPago());
        pago.setMonto(total);
        pago.setEstadoPago(EstadoPago.CONFIRMADO);
        pago.setFechaPago(LocalDateTime.now());
        pago.setActivo(true);

        pagoRepository.save(pago);

        BigDecimal montoEfectivo = BigDecimal.ZERO;
        BigDecimal montoDigital = BigDecimal.ZERO;
        BigDecimal cambio = BigDecimal.ZERO;

        if (dto.metodoPago() == MetodoPago.EFECTIVO) {
            BigDecimal recibido = dto.montoRecibido() != null ? dto.montoRecibido() : BigDecimal.ZERO;

            montoEfectivo = total;
            cambio = recibido.subtract(total);

            if (cambio.compareTo(BigDecimal.ZERO) < 0) {
                cambio = BigDecimal.ZERO;
            }
        }

        if (dto.metodoPago() == MetodoPago.QR || dto.metodoPago() == MetodoPago.TRANSFERENCIA) {
            montoDigital = total;
        }

        if (dto.metodoPago() == MetodoPago.MIXTO) {
            BigDecimal efectivoRecibido = dto.montoEfectivo() != null ? dto.montoEfectivo() : BigDecimal.ZERO;
            BigDecimal digitalRecibido = dto.montoDigital() != null ? dto.montoDigital() : BigDecimal.ZERO;

            montoDigital = digitalRecibido;

            BigDecimal efectivoNecesario = total.subtract(montoDigital);

            if (efectivoNecesario.compareTo(BigDecimal.ZERO) < 0) {
                efectivoNecesario = BigDecimal.ZERO;
            }

            montoEfectivo = efectivoNecesario;

            BigDecimal totalRecibido = efectivoRecibido.add(digitalRecibido);
            cambio = totalRecibido.subtract(total);

            if (cambio.compareTo(BigDecimal.ZERO) < 0) {
                cambio = BigDecimal.ZERO;
            }
        }

        pedido.setEstado(EstadoPedido.ENTREGADO);
        pedidoRepository.save(pedido);

        Venta venta = new Venta();
        venta.setPedido(pedido);
        venta.setPago(pago);
        venta.setMontoTotal(total);
        venta.setMetodoPago(dto.metodoPago());
        venta.setEstadoVenta(EstadoVenta.COMPLETADA);
        venta.setMontoEfectivo(montoEfectivo);
        venta.setMontoDigital(montoDigital);
        venta.setCambio(cambio);
        venta.setComprobante(generarComprobantePedidoConvertido(dto));
        venta.setActivo(true);

        Venta ventaGuardada = ventaRepository.save(venta);

        generarFacturaPedidoConvertidoSiCorresponde(dto, ventaGuardada);

        return ventaGuardada;
    }

    private void validarPagoPedidoConvertido(ConvertirPedidoVentaDto dto, BigDecimal total) {
        if (dto.metodoPago() == MetodoPago.EFECTIVO) {
            BigDecimal recibido = dto.montoRecibido() != null ? dto.montoRecibido() : BigDecimal.ZERO;

            if (recibido.compareTo(total) < 0) {
                throw new IllegalArgumentException("El monto recibido no cubre el total del pedido");
            }
        }

        if ((dto.metodoPago() == MetodoPago.QR || dto.metodoPago() == MetodoPago.TRANSFERENCIA)
                && (dto.referenciaPago() == null || dto.referenciaPago().isBlank())) {
            throw new IllegalArgumentException("La referencia del pago digital es obligatoria");
        }

        if (dto.metodoPago() == MetodoPago.MIXTO) {
            BigDecimal efectivo = dto.montoEfectivo() != null ? dto.montoEfectivo() : BigDecimal.ZERO;
            BigDecimal digital = dto.montoDigital() != null ? dto.montoDigital() : BigDecimal.ZERO;

            if (efectivo.add(digital).compareTo(total) < 0) {
                throw new IllegalArgumentException("El pago mixto no cubre el total del pedido");
            }
        }

        if (Boolean.TRUE.equals(dto.generarFactura())) {
            if (dto.nitCi() == null || dto.nitCi().isBlank()) {
                throw new IllegalArgumentException("El NIT/CI es obligatorio para generar factura");
            }

            if (dto.razonSocial() == null || dto.razonSocial().isBlank()) {
                throw new IllegalArgumentException("La razón social es obligatoria para generar factura");
            }
        }
    }

    private String generarComprobantePedidoConvertido(ConvertirPedidoVentaDto dto) {
        if (Boolean.TRUE.equals(dto.generarFactura())) {
            return "FACTURA | NIT/CI: " + dto.nitCi()
                    + " | RAZON SOCIAL: " + dto.razonSocial()
                    + " | PEDIDO CONVERTIDO EN VENTA";
        }

        return "TICKET SIMPLE | PEDIDO CONVERTIDO EN VENTA";
    }

    private void generarFacturaPedidoConvertidoSiCorresponde(ConvertirPedidoVentaDto dto, Venta ventaGuardada) {
        if (!Boolean.TRUE.equals(dto.generarFactura())) {
            return;
        }

        if (facturaRepository.existsByVentaId(ventaGuardada.getId())) {
            return;
        }

        Factura factura = new Factura();
        factura.setVenta(ventaGuardada);
        factura.setNitCi(dto.nitCi());
        factura.setRazonSocial(dto.razonSocial());
        factura.setTotal(ventaGuardada.getMontoTotal());
        factura.setMetodoPago(ventaGuardada.getMetodoPago());
        factura.setEstadoFactura(EstadoFactura.EMITIDA);
        factura.setActivo(true);

        facturaRepository.save(factura);
    }


    @Override
    @Transactional
    public Optional<Venta> updateVenta(Integer id, UpdateVentaDto dto) {
        Optional<Venta> ventaBuscada = ventaRepository.findById(id);

        if (ventaBuscada.isEmpty()) {
            return Optional.empty();
        }

        Venta venta = ventaBuscada.get();

        if (dto.pagoId() != null) {
            Pago pago = obtenerPagoValido(dto.pagoId(), venta.getPedido().getId());

            if (ventaRepository.existsByPagoId(dto.pagoId())
                    && (venta.getPago() == null || !venta.getPago().getId().equals(dto.pagoId()))) {
                throw new IllegalArgumentException("Este pago ya está asociado a otra venta");
            }

            venta.setPago(pago);
            venta.setMetodoPago(pago.getMetodo());
            venta.setMontoTotal(venta.getPedido().getTotal());


        }



        if (dto.comprobante() != null) {
            venta.setComprobante(dto.comprobante());
        }

        if (dto.estadoVenta() != null) {
            if (dto.estadoVenta() == EstadoVenta.COMPLETADA) {
                completarVenta(venta);
            }

            if (dto.estadoVenta() == EstadoVenta.CANCELADA) {
                cancelarVenta(venta);
            }

            if (dto.estadoVenta() == EstadoVenta.PENDIENTE) {
                venta.setEstadoVenta(EstadoVenta.PENDIENTE);
            }
        }

        if (dto.activo() != null) {
            venta.setActivo(dto.activo());
        }

        return Optional.of(ventaRepository.save(venta));
    }

    @Override
    @Transactional
    public Optional<Venta> deleteVenta(Integer id) {
        Optional<Venta> ventaBuscada = ventaRepository.findById(id);

        if (ventaBuscada.isEmpty()) {
            return Optional.empty();
        }

        Venta venta = ventaBuscada.get();

        cancelarVenta(venta);

        return Optional.of(ventaRepository.save(venta));
    }

    private Pago obtenerPagoValido(Integer pagoId, Integer pedidoId) {
        Pago pago = pagoRepository.findById(pagoId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "El pago con id " + pagoId + " no existe"
                ));

        if (pago.getPedido() == null) {
            throw new IllegalArgumentException("El pago no tiene pedido asociado");
        }

        if (!pago.getPedido().getId().equals(pedidoId)) {
            throw new IllegalArgumentException("El pago no pertenece al pedido seleccionado");
        }

        if (pago.getEstadoPago() != EstadoPago.CONFIRMADO) {
            throw new IllegalArgumentException("El pago todavía no está confirmado");
        }

        return pago;
    }

    private void completarVenta(Venta venta) {
        if (venta.getPago() == null) {
            throw new IllegalArgumentException("No se puede completar una venta sin pago");
        }

        if (venta.getPago().getEstadoPago() != EstadoPago.CONFIRMADO) {
            throw new IllegalArgumentException("No se puede completar la venta porque el pago no está confirmado");
        }

        venta.setEstadoVenta(EstadoVenta.COMPLETADA);
        venta.setActivo(true);
        venta.setMontoTotal(venta.getPedido().getTotal());
        venta.setMetodoPago(venta.getPago().getMetodo());

        Pedido pedido = venta.getPedido();

        if (pedido.getEstado() != EstadoPedido.CANCELADO) {
            pedido.setEstado(EstadoPedido.ENTREGADO);
            pedidoRepository.save(pedido);
        }
    }

    private void cancelarVenta(Venta venta) {
        if (venta.getEstadoVenta() == EstadoVenta.CANCELADA) {
            return;
        }

        venta.setEstadoVenta(EstadoVenta.CANCELADA);
        venta.setActivo(false);

        Pago pago = venta.getPago();

        if (pago != null && pago.getEstadoPago() == EstadoPago.CONFIRMADO) {
            pago.setEstadoPago(EstadoPago.REEMBOLSADO);
            pagoRepository.save(pago);
        }

        Pedido pedido = venta.getPedido();

        if (pedido != null && pedido.getEstado() != EstadoPedido.CANCELADO) {
            restaurarStockDelPedido(pedido);
            pedido.setEstado(EstadoPedido.CANCELADO);
            pedidoRepository.save(pedido);
        }
    }

    private void restaurarStockDelPedido(Pedido pedido) {
        for (PedidoDetalle detalle : pedido.getDetalles()) {
            Producto producto = detalle.getProducto();

            producto.setStock(producto.getStock() + detalle.getCantidad());

            productoRepository.save(producto);
        }
    }
}