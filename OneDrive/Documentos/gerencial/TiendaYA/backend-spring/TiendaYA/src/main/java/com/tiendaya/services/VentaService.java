package com.tiendaya.services;

import com.tiendaya.dtos.CreateVentaDto;
import com.tiendaya.dtos.UpdateVentaDto;
import com.tiendaya.interfaces.IVentaService;
import com.tiendaya.models.Pago;
import com.tiendaya.models.Pedido;
import com.tiendaya.models.Venta;
import com.tiendaya.models.enums.EstadoPedido;
import com.tiendaya.models.enums.EstadoVenta;
import com.tiendaya.repositories.PagoRepository;
import com.tiendaya.repositories.PedidoRepository;
import com.tiendaya.repositories.VentaRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VentaService implements IVentaService {

    private final VentaRepository ventaRepository;
    private final PedidoRepository pedidoRepository;
    private final PagoRepository pagoRepository;

    public VentaService(
            VentaRepository ventaRepository,
            PedidoRepository pedidoRepository,
            PagoRepository pagoRepository
    ) {
        this.ventaRepository = ventaRepository;
        this.pedidoRepository = pedidoRepository;
        this.pagoRepository = pagoRepository;
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

        Venta venta = new Venta();

        venta.setPedido(pedido);
        venta.setMontoTotal(dto.montoTotal() != null ? dto.montoTotal() : pedido.getTotal());
        venta.setEstadoVenta(dto.estadoVenta() != null ? dto.estadoVenta() : EstadoVenta.PENDIENTE);
        venta.setComprobante(dto.comprobante());
        venta.setActivo(true);

        if (dto.pagoId() != null) {
            Pago pago = obtenerPagoValido(dto.pagoId(), pedido.getId());

            if (ventaRepository.existsByPagoId(dto.pagoId())) {
                throw new IllegalArgumentException("Este pago ya está asociado a una venta");
            }

            venta.setPago(pago);
        }

        return ventaRepository.save(venta);
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

            boolean pagoYaUsadoPorOtraVenta =
                    ventaRepository.existsByPagoId(dto.pagoId())
                            && (
                            venta.getPago() == null
                                    || !venta.getPago().getId().equals(dto.pagoId())
                    );

            if (pagoYaUsadoPorOtraVenta) {
                throw new IllegalArgumentException("Este pago ya está asociado a otra venta");
            }

            venta.setPago(pago);
        }

        if (dto.montoTotal() != null) {
            venta.setMontoTotal(dto.montoTotal());
        }

        if (dto.estadoVenta() != null) {
            venta.setEstadoVenta(dto.estadoVenta());
        }

        if (dto.comprobante() != null) {
            venta.setComprobante(dto.comprobante());
        }

        if (dto.activo() != null) {
            venta.setActivo(dto.activo());
        }

        Venta ventaActualizada = ventaRepository.save(venta);

        return Optional.of(ventaActualizada);
    }

    @Override
    @Transactional
    public Optional<Venta> deleteVenta(Integer id) {
        Optional<Venta> ventaBuscada = ventaRepository.findById(id);

        if (ventaBuscada.isEmpty()) {
            return Optional.empty();
        }

        Venta venta = ventaBuscada.get();

        venta.setEstadoVenta(EstadoVenta.CANCELADA);
        venta.setActivo(false);

        Venta ventaCancelada = ventaRepository.save(venta);

        return Optional.of(ventaCancelada);
    }

    private Pago obtenerPagoValido(Integer pagoId, Integer pedidoId) {
        Pago pago = pagoRepository.findById(pagoId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "El pago con id " + pagoId + " no existe"
                ));

        if (!pago.getActivo()) {
            throw new IllegalArgumentException("El pago seleccionado está desactivado");
        }

        if (!pago.getPedido().getId().equals(pedidoId)) {
            throw new IllegalArgumentException("El pago seleccionado no pertenece al pedido indicado");
        }

        return pago;
    }
}