package com.tiendaya.services;

import com.tiendaya.dtos.*;
import com.tiendaya.interfaces.ICajeroDashboardService;
import com.tiendaya.models.*;
import com.tiendaya.models.enums.*;
import com.tiendaya.repositories.PagoRepository;
import com.tiendaya.repositories.PedidoRepository;
import com.tiendaya.repositories.ProductoRepository;
import com.tiendaya.repositories.VentaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CajeroDashboardService implements ICajeroDashboardService {

    private final VentaRepository ventaRepository;
    private final PedidoRepository pedidoRepository;
    private final PagoRepository pagoRepository;
    private final ProductoRepository productoRepository;

    public CajeroDashboardService(
            VentaRepository ventaRepository,
            PedidoRepository pedidoRepository,
            PagoRepository pagoRepository,
            ProductoRepository productoRepository
    ) {
        this.ventaRepository = ventaRepository;
        this.pedidoRepository = pedidoRepository;
        this.pagoRepository = pagoRepository;
        this.productoRepository = productoRepository;
    }

    @Override
    public CajeroDashboardDto obtenerDashboard() {
        LocalDate hoy = LocalDate.now();
        LocalDateTime inicioDia = hoy.atStartOfDay();
        LocalDateTime finDia = hoy.plusDays(1).atStartOfDay();
        LocalDateTime ahora = LocalDateTime.now();

        List<Venta> ventas = ventaRepository.findAll();
        List<Pedido> pedidos = pedidoRepository.findAllByOrderByIdAsc();
        List<Pago> pagos = pagoRepository.findAll();
        List<Producto> productos = productoRepository.findAll();

        BigDecimal ventasDelDia = ventas.stream()
                .filter(venta -> Boolean.TRUE.equals(venta.getActivo()))
                .filter(venta -> venta.getEstadoVenta() == EstadoVenta.COMPLETADA)
                .filter(venta -> estaEnElDia(venta.getFechaVenta(), inicioDia, finDia))
                .map(Venta::getMontoTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Long pedidosActivos = pedidos.stream()
                .filter(pedido -> esPedidoActivo(pedido.getEstado()))
                .count();

        BigDecimal totalEfectivo = ventas.stream()
                .filter(venta -> Boolean.TRUE.equals(venta.getActivo()))
                .filter(venta -> venta.getEstadoVenta() == EstadoVenta.COMPLETADA)
                .filter(venta -> estaEnElDia(venta.getFechaVenta(), inicioDia, finDia))
                .map(venta -> venta.getMontoEfectivo() != null
                        ? venta.getMontoEfectivo()
                        : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalQrTransferencia = ventas.stream()
                .filter(venta -> Boolean.TRUE.equals(venta.getActivo()))
                .filter(venta -> venta.getEstadoVenta() == EstadoVenta.COMPLETADA)
                .filter(venta -> estaEnElDia(venta.getFechaVenta(), inicioDia, finDia))
                .map(venta -> venta.getMontoDigital() != null
                        ? venta.getMontoDigital()
                        : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        DashboardResumenDto resumen = new DashboardResumenDto(
                ventasDelDia,
                pedidosActivos,
                totalEfectivo,
                totalQrTransferencia
        );

        Map<Integer, Pago> pagosPorPedido = pagos.stream()
                .filter(pago -> pago.getPedido() != null)
                .collect(Collectors.toMap(
                        pago -> pago.getPedido().getId(),
                        pago -> pago,
                        (pagoExistente, pagoNuevo) -> pagoExistente
                ));

        List<DashboardPedidoDto> pedidosPendientes = pedidos.stream()
                .filter(pedido -> esPedidoPendienteParaCajero(pedido.getEstado()))
                .sorted(Comparator.comparing(Pedido::getId).reversed())
                .limit(4)
                .map(pedido -> convertirPedidoADashboardDto(pedido, pagosPorPedido))
                .toList();

        List<DashboardAlertaDto> alertas = productos.stream()
                .filter(producto -> Boolean.TRUE.equals(producto.getActivo()))
                .flatMap(producto -> generarAlertasProducto(producto, ahora).stream())
                .limit(5)
                .toList();

        DashboardEstadoSistemaDto estadoSistema = new DashboardEstadoSistemaDto(
                true,
                true,
                0
        );

        return new CajeroDashboardDto(
                resumen,
                pedidosPendientes,
                alertas,
                estadoSistema
        );
    }

    private boolean estaEnElDia(LocalDateTime fecha, LocalDateTime inicioDia, LocalDateTime finDia) {
        return fecha != null && !fecha.isBefore(inicioDia) && fecha.isBefore(finDia);
    }

    private boolean esPedidoActivo(EstadoPedido estado) {
        return estado == EstadoPedido.PENDIENTE
                || estado == EstadoPedido.EN_PREPARACION
                || estado == EstadoPedido.LISTO_PARA_ENTREGAR
                || estado == EstadoPedido.EN_CAMINO;
    }

    private boolean esPedidoPendienteParaCajero(EstadoPedido estado) {
        return estado == EstadoPedido.PENDIENTE
                || estado == EstadoPedido.EN_PREPARACION
                || estado == EstadoPedido.LISTO_PARA_ENTREGAR;
    }

    private DashboardPedidoDto convertirPedidoADashboardDto(Pedido pedido, Map<Integer, Pago> pagosPorPedido) {
        Pago pago = pagosPorPedido.get(pedido.getId());

        String metodoPago = "Pendiente";

        if (pago != null) {
            metodoPago = pago.getMetodo().name();
        }

        return new DashboardPedidoDto(
                pedido.getId(),
                pedido.getCliente().getNombre(),
                pedido.getCliente().getTelefono(),
                pedido.getEstado(),
                pedido.getTotal(),
                metodoPago,
                pedido.getFechaHora()
        );
    }

    private List<DashboardAlertaDto> generarAlertasProducto(Producto producto, LocalDateTime ahora) {
        List<DashboardAlertaDto> alertas = new java.util.ArrayList<>();

        if (producto.getStock() == 0) {
            alertas.add(new DashboardAlertaDto(
                    "SIN_STOCK",
                    producto.getNombre(),
                    "Producto agotado",
                    producto.getImageUrl()
            ));
        } else if (producto.getStock() <= 3) {
            alertas.add(new DashboardAlertaDto(
                    "STOCK_BAJO",
                    producto.getNombre(),
                    "Quedan " + producto.getStock() + " unidades",
                    producto.getImageUrl()
            ));
        }

        if (producto.getFechaVencimiento() != null
                && !producto.getFechaVencimiento().isBefore(ahora)
                && !producto.getFechaVencimiento().isAfter(ahora.plusDays(7))) {

            alertas.add(new DashboardAlertaDto(
                    "POR_VENCER",
                    producto.getNombre(),
                    "Vence el " + producto.getFechaVencimiento(),
                    producto.getImageUrl()
            ));
        }

        return alertas;
    }
}