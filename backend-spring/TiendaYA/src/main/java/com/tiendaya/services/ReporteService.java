package com.tiendaya.services;

import com.tiendaya.dtos.*;
import com.tiendaya.models.PedidoDetalle;
import com.tiendaya.models.Venta;
import com.tiendaya.models.enums.EstadoPedido;
import com.tiendaya.models.enums.EstadoVenta;
import com.tiendaya.models.enums.MetodoPago;
import com.tiendaya.repositories.FacturaRepository;
import com.tiendaya.repositories.PedidoRepository;
import com.tiendaya.repositories.VentaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReporteService {

    private final VentaRepository ventaRepository;
    private final PedidoRepository pedidoRepository;
    private final FacturaRepository facturaRepository;

    public ReporteService(
            VentaRepository ventaRepository,
            PedidoRepository pedidoRepository,
            FacturaRepository facturaRepository
    ) {
        this.ventaRepository = ventaRepository;
        this.pedidoRepository = pedidoRepository;
        this.facturaRepository = facturaRepository;
    }

    public ReporteGeneralResponseDto obtenerReporte(
            LocalDate desde,
            LocalDate hasta,
            String metodo,
            String estado
    ) {
        LocalDateTime inicio = desde.atStartOfDay();
        LocalDateTime fin = hasta.plusDays(1).atStartOfDay();

        List<Venta> ventas = ventaRepository.findAll()
                .stream()
                .filter(venta -> Boolean.TRUE.equals(venta.getActivo()))
                .filter(venta -> venta.getCreatedAt() != null)
                .filter(venta -> !venta.getCreatedAt().isBefore(inicio))
                .filter(venta -> venta.getCreatedAt().isBefore(fin))
                .filter(venta -> filtrarMetodo(venta, metodo))
                .filter(venta -> filtrarEstado(venta, estado))
                .toList();

        BigDecimal ventasTotales = ventas.stream()
                .map(this::obtenerMontoVenta)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Integer totalTransacciones = ventas.size();

        BigDecimal ticketPromedio = totalTransacciones == 0
                ? BigDecimal.ZERO
                : ventasTotales.divide(BigDecimal.valueOf(totalTransacciones), 2, RoundingMode.HALF_UP);

        Integer facturasEmitidas = (int) ventas.stream()
                .filter(venta -> facturaRepository.existsByVentaId(venta.getId()))
                .count();

        Integer pedidosEntregados = (int) pedidoRepository.findAll()
                .stream()
                .filter(pedido -> pedido.getEstado() == EstadoPedido.ENTREGADO)
                .filter(pedido -> pedido.getCreatedAt() != null)
                .filter(pedido -> !pedido.getCreatedAt().isBefore(inicio))
                .filter(pedido -> pedido.getCreatedAt().isBefore(fin))
                .count();

        return new ReporteGeneralResponseDto(
                ventasTotales,
                pedidosEntregados,
                ticketPromedio,
                facturasEmitidas,
                obtenerVentasPorDia(ventas, desde, hasta),
                obtenerMetodosPago(ventas, ventasTotales),
                obtenerProductosTop(ventas),
                obtenerUltimosMovimientos(ventas),
                obtenerResumenCanal(ventas, ventasTotales)
        );
    }

    private boolean filtrarMetodo(Venta venta, String metodo) {
        if (metodo == null || metodo.isBlank() || metodo.equalsIgnoreCase("TODOS")) {
            return true;
        }

        try {
            MetodoPago metodoPago = MetodoPago.valueOf(metodo.toUpperCase());
            return venta.getMetodoPago() == metodoPago;
        } catch (IllegalArgumentException error) {
            return true;
        }
    }

    private boolean filtrarEstado(Venta venta, String estado) {
        if (estado == null || estado.isBlank() || estado.equalsIgnoreCase("TODOS")) {
            return true;
        }

        try {
            EstadoVenta estadoVenta = EstadoVenta.valueOf(estado.toUpperCase());
            return venta.getEstadoVenta() == estadoVenta;
        } catch (IllegalArgumentException error) {
            return true;
        }
    }

    private BigDecimal obtenerMontoVenta(Venta venta) {
        return venta.getMontoTotal() != null ? venta.getMontoTotal() : BigDecimal.ZERO;
    }

    private List<ReporteVentaDiaDto> obtenerVentasPorDia(
            List<Venta> ventas,
            LocalDate desde,
            LocalDate hasta
    ) {
        Map<LocalDate, BigDecimal> totalesPorDia = ventas.stream()
                .collect(Collectors.groupingBy(
                        venta -> venta.getCreatedAt().toLocalDate(),
                        TreeMap::new,
                        Collectors.reducing(BigDecimal.ZERO, this::obtenerMontoVenta, BigDecimal::add)
                ));

        List<ReporteVentaDiaDto> resultado = new ArrayList<>();

        LocalDate fecha = desde;
        while (!fecha.isAfter(hasta)) {
            BigDecimal total = totalesPorDia.getOrDefault(fecha, BigDecimal.ZERO);
            String dia = String.format("%02d/%02d", fecha.getDayOfMonth(), fecha.getMonthValue());

            resultado.add(new ReporteVentaDiaDto(dia, total));
            fecha = fecha.plusDays(1);
        }

        return resultado;
    }

    private List<ReporteMetodoPagoDto> obtenerMetodosPago(
            List<Venta> ventas,
            BigDecimal totalGeneral
    ) {
        Map<MetodoPago, BigDecimal> totalPorMetodo = ventas.stream()
                .collect(Collectors.groupingBy(
                        Venta::getMetodoPago,
                        Collectors.reducing(BigDecimal.ZERO, this::obtenerMontoVenta, BigDecimal::add)
                ));

        return Arrays.stream(MetodoPago.values())
                .map(metodo -> {
                    BigDecimal monto = totalPorMetodo.getOrDefault(metodo, BigDecimal.ZERO);

                    int porcentaje = totalGeneral.compareTo(BigDecimal.ZERO) == 0
                            ? 0
                            : monto.multiply(BigDecimal.valueOf(100))
                              .divide(totalGeneral, 0, RoundingMode.HALF_UP)
                              .intValue();

                    String label = switch (metodo) {
                        case EFECTIVO -> "Efectivo";
                        case QR -> "QR";
                        case TRANSFERENCIA -> "Transferencia";
                        case MIXTO -> "Mixto";
                    };

                    return new ReporteMetodoPagoDto(label, porcentaje, monto);
                })
                .filter(item -> item.monto().compareTo(BigDecimal.ZERO) > 0)
                .toList();
    }

    private List<ReporteProductoTopDto> obtenerProductosTop(List<Venta> ventas) {
        Map<String, Integer> cantidades = new HashMap<>();

        for (Venta venta : ventas) {
            if (venta.getPedido() == null || venta.getPedido().getDetalles() == null) {
                continue;
            }

            for (PedidoDetalle detalle : venta.getPedido().getDetalles()) {
                if (detalle.getProducto() == null) {
                    continue;
                }

                String nombre = detalle.getProducto().getNombre();
                Integer cantidad = detalle.getCantidad() != null ? detalle.getCantidad() : 0;

                cantidades.merge(nombre, cantidad, Integer::sum);
            }
        }

        List<Map.Entry<String, Integer>> ordenados = cantidades.entrySet()
                .stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(5)
                .toList();

        List<ReporteProductoTopDto> resultado = new ArrayList<>();

        for (int i = 0; i < ordenados.size(); i++) {
            Map.Entry<String, Integer> item = ordenados.get(i);

            resultado.add(new ReporteProductoTopDto(
                    i + 1,
                    item.getKey(),
                    item.getValue(),
                    obtenerEmojiProducto(item.getKey())
            ));
        }

        return resultado;
    }

    private String obtenerEmojiProducto(String nombre) {
        String texto = nombre.toLowerCase();

        if (texto.contains("pan")) return "🍞";
        if (texto.contains("coca") || texto.contains("bebida")) return "🥤";
        if (texto.contains("arroz")) return "🌾";
        if (texto.contains("leche")) return "🥛";
        if (texto.contains("azucar") || texto.contains("azúcar")) return "🍬";
        if (texto.contains("hamburguesa")) return "🍔";

        return "📦";
    }

    private List<ReporteMovimientoDto> obtenerUltimosMovimientos(List<Venta> ventas) {
        return ventas.stream()
                .sorted(Comparator.comparing(Venta::getCreatedAt).reversed())
                .limit(5)
                .map(venta -> {
                    String tipo = venta.getPedido() != null && venta.getPedido().getRepartidor() != null
                            ? "Pedido"
                            : "Venta";

                    String cliente = venta.getPedido() != null && venta.getPedido().getCliente() != null
                            ? venta.getPedido().getCliente().getNombre()
                            : "Cliente general";

                    String estado = venta.getPedido() != null && venta.getPedido().getEstado() == EstadoPedido.ENTREGADO
                            ? "Entregado"
                            : traducirEstadoVenta(venta.getEstadoVenta());

                    return new ReporteMovimientoDto(
                            venta.getCreatedAt(),
                            tipo,
                            cliente,
                            traducirMetodo(venta.getMetodoPago()),
                            obtenerMontoVenta(venta),
                            estado
                    );
                })
                .toList();
    }

    private List<ReporteCanalDto> obtenerResumenCanal(
            List<Venta> ventas,
            BigDecimal totalGeneral
    ) {
        List<Venta> ventasDelivery = ventas.stream()
                .filter(venta -> venta.getPedido() != null && venta.getPedido().getRepartidor() != null)
                .toList();

        List<Venta> ventasTienda = ventas.stream()
                .filter(venta -> venta.getPedido() == null || venta.getPedido().getRepartidor() == null)
                .toList();

        BigDecimal totalTienda = ventasTienda.stream()
                .map(this::obtenerMontoVenta)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDelivery = ventasDelivery.stream()
                .map(this::obtenerMontoVenta)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return List.of(
                new ReporteCanalDto(
                        "Nueva venta",
                        totalTienda,
                        calcularPorcentaje(totalTienda, totalGeneral),
                        ventasTienda.size()
                ),
                new ReporteCanalDto(
                        "Pedidos delivery",
                        totalDelivery,
                        calcularPorcentaje(totalDelivery, totalGeneral),
                        ventasDelivery.size()
                )
        );
    }

    private Integer calcularPorcentaje(BigDecimal monto, BigDecimal total) {
        if (total.compareTo(BigDecimal.ZERO) == 0) {
            return 0;
        }

        return monto.multiply(BigDecimal.valueOf(100))
                .divide(total, 0, RoundingMode.HALF_UP)
                .intValue();
    }

    private String traducirMetodo(MetodoPago metodoPago) {
        if (metodoPago == null) return "-";

        return switch (metodoPago) {
            case EFECTIVO -> "Efectivo";
            case QR -> "QR";
            case TRANSFERENCIA -> "Transferencia";
            case MIXTO -> "Mixto";
        };
    }

    private String traducirEstadoVenta(EstadoVenta estadoVenta) {
        if (estadoVenta == null) return "-";

        return switch (estadoVenta) {
            case COMPLETADA -> "Completado";
            case CANCELADA -> "Cancelado";
            case PENDIENTE -> "Pendiente";
        };
    }
}