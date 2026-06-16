package com.tiendaya.services;

import com.tiendaya.dtos.CierreCajaResponseDto;
import com.tiendaya.dtos.MovimientoCierreCajaDto;
import com.tiendaya.models.Venta;
import com.tiendaya.models.enums.EstadoVenta;
import com.tiendaya.models.enums.MetodoPago;
import com.tiendaya.repositories.FacturaRepository;
import com.tiendaya.repositories.VentaRepository;
import org.springframework.stereotype.Service;
import com.tiendaya.dtos.CreateCierreCajaDto;
import com.tiendaya.models.CierreCaja;
import com.tiendaya.models.Usuario;
import com.tiendaya.repositories.CierreCajaRepository;
import com.tiendaya.repositories.UsuarioRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class CierreCajaService {

    private final VentaRepository ventaRepository;
    private final FacturaRepository facturaRepository;
    private final CierreCajaRepository cierreCajaRepository;
    private final UsuarioRepository usuarioRepository;

    public CierreCajaService(
            VentaRepository ventaRepository,
            FacturaRepository facturaRepository,
            CierreCajaRepository cierreCajaRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.ventaRepository = ventaRepository;
        this.facturaRepository = facturaRepository;
        this.cierreCajaRepository = cierreCajaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public CierreCajaResponseDto obtenerCierreDelDia() {
        LocalDate hoy = LocalDate.now();

        var inicioDia = hoy.atStartOfDay();
        var finDia = hoy.plusDays(1).atStartOfDay();

        var ultimoCierreDelDia = cierreCajaRepository
                .findTopByActivoTrueAndFechaCierreBetweenOrderByFechaCierreDesc(inicioDia, finDia);

        LocalDateTime inicioDelTurno = ultimoCierreDelDia
                .map(CierreCaja::getFechaCierre)
                .orElse(inicioDia);

        List<Venta> ventasDelDia = ventaRepository.findAll()
                .stream()
                .filter(venta -> Boolean.TRUE.equals(venta.getActivo()))
                .filter(venta -> venta.getEstadoVenta() == EstadoVenta.COMPLETADA)
                .filter(venta -> venta.getCreatedAt() != null)
                .filter(venta -> venta.getCreatedAt().isAfter(inicioDelTurno))
                .filter(venta -> venta.getCreatedAt().isBefore(finDia))
                .toList();

        BigDecimal totalVentas = sumarVentas(ventasDelDia);

        BigDecimal efectivo = ventasDelDia.stream()
                .map(venta -> venta.getMontoEfectivo() != null ? venta.getMontoEfectivo() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal digital = ventasDelDia.stream()
                .map(venta -> venta.getMontoDigital() != null ? venta.getMontoDigital() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal mixto = ventasDelDia.stream()
                .filter(venta -> venta.getMetodoPago() == MetodoPago.MIXTO)
                .map(venta -> venta.getMontoTotal() != null ? venta.getMontoTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Integer transacciones = ventasDelDia.size();

        Integer facturasEmitidas = (int) ventasDelDia.stream()
                .filter(venta -> facturaRepository.existsByVentaId(venta.getId()))
                .count();

        Integer pedidosConvertidos = (int) ventasDelDia.stream()
                .filter(venta -> venta.getPedido() != null)
                .count();

        BigDecimal enviosCobrados = BigDecimal.ZERO;
        BigDecimal descuentosAplicados = BigDecimal.ZERO;

        List<MovimientoCierreCajaDto> ultimosMovimientos = ventasDelDia.stream()
                .sorted(Comparator.comparing(Venta::getCreatedAt).reversed())
                .limit(5)
                .map(venta -> new MovimientoCierreCajaDto(
                        venta.getCreatedAt(),
                        venta.getPedido() != null
                                ? "Pedido #" + venta.getPedido().getId() + " convertido"
                                : "Venta #" + venta.getId(),
                        venta.getMetodoPago() != null ? venta.getMetodoPago().name() : "-",
                        venta.getMontoTotal() != null ? venta.getMontoTotal() : BigDecimal.ZERO
                ))
                .toList();

        return new CierreCajaResponseDto(
                totalVentas,
                transacciones,
                facturasEmitidas,
                pedidosConvertidos,
                efectivo,
                digital,
                mixto,
                enviosCobrados,
                descuentosAplicados,
                totalVentas,
                ultimosMovimientos
        );
    }

    public CierreCaja cerrarCaja(CreateCierreCajaDto dto) {
        CierreCajaResponseDto resumen = obtenerCierreDelDia();

        CierreCaja cierreCaja = new CierreCaja();

        if (dto.usuarioId() != null) {
            Usuario usuario = usuarioRepository.findById(dto.usuarioId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "El usuario con id " + dto.usuarioId() + " no existe"
                    ));

            cierreCaja.setUsuario(usuario);
        }

        cierreCaja.setVentasDia(resumen.ventasDelDia());
        cierreCaja.setTransacciones(resumen.transacciones());
        cierreCaja.setFacturasEmitidas(resumen.facturasEmitidas());
        cierreCaja.setPedidosConvertidos(resumen.pedidosConvertidos());

        cierreCaja.setEfectivo(resumen.efectivo());
        cierreCaja.setQrTransferencias(resumen.qrTransferencia());
        cierreCaja.setMixto(resumen.mixto());
        cierreCaja.setEnviosCobrados(resumen.enviosCobrados());
        cierreCaja.setDescuentosAplicados(resumen.descuentosAplicados());
        cierreCaja.setTotalRecaudado(dto.totalRecaudado());

        cierreCaja.setMontoBaseInicial(dto.montoBaseInicial());
        cierreCaja.setEfectivoEsperado(dto.efectivoEsperado());
        cierreCaja.setEfectivoContado(dto.efectivoContado());
        cierreCaja.setDiferencia(dto.diferencia());
        cierreCaja.setObservaciones(dto.observaciones());

        if (dto.diferencia().abs().compareTo(new BigDecimal("5")) <= 0) {
            cierreCaja.setEstado("CUADRADO");
        } else {
            cierreCaja.setEstado("CON_DIFERENCIA");
        }

        cierreCaja.setActivo(true);

        return cierreCajaRepository.save(cierreCaja);
    }

    private BigDecimal sumarVentas(List<Venta> ventas) {
        return ventas.stream()
                .map(venta -> venta.getMontoTotal() != null ? venta.getMontoTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}