package com.tiendaya.services;

import com.tiendaya.dtos.CreatePagoDto;
import com.tiendaya.dtos.UpdatePagoDto;
import com.tiendaya.interfaces.IPagoService;
import com.tiendaya.models.Pago;
import com.tiendaya.models.Pedido;
import com.tiendaya.models.enums.EstadoPago;
import com.tiendaya.models.enums.EstadoPedido;
import com.tiendaya.repositories.PagoRepository;
import com.tiendaya.repositories.PedidoRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PagoService implements IPagoService {

    private final PagoRepository pagoRepository;
    private final PedidoRepository pedidoRepository;

    public PagoService(
            PagoRepository pagoRepository,
            PedidoRepository pedidoRepository
    ) {
        this.pagoRepository = pagoRepository;
        this.pedidoRepository = pedidoRepository;
    }

    @Override
    public List<Pago> getPagos() {
        return pagoRepository.findByActivoTrueOrderByIdAsc();
    }

    @Override
    public Optional<Pago> getPago(Integer id) {
        return pagoRepository.findById(id);
    }

    @Override
    public Optional<Pago> getPagoPorPedido(Integer pedidoId) {
        return pagoRepository.findByPedidoId(pedidoId);
    }

    @Override
    public List<Pago> getPagosPorEstado(EstadoPago estadoPago) {
        return pagoRepository.findByEstadoPagoOrderByIdAsc(estadoPago);
    }

    @Override
    @Transactional
    public Pago createPago(CreatePagoDto dto) {
        Pedido pedido = pedidoRepository.findById(dto.pedidoId())
                .orElseThrow(() -> new IllegalArgumentException("El pedido con id " + dto.pedidoId() + " no existe"));

        if (pedido.getEstado() == EstadoPedido.CANCELADO) {
            throw new IllegalArgumentException("No se puede registrar pago para un pedido cancelado");
        }

        if (pagoRepository.existsByPedidoId(dto.pedidoId())) {
            throw new IllegalArgumentException("Este pedido ya tiene un pago registrado");
        }

        Pago pago = new Pago();

        pago.setPedido(pedido);
        pago.setMetodo(dto.metodo());
        pago.setMonto(dto.monto() != null ? dto.monto() : pedido.getTotal());
        pago.setEstadoPago(dto.estadoPago() != null ? dto.estadoPago() : EstadoPago.PENDIENTE);
        pago.setFechaPago(convertirFecha(dto.fechaPago()));
        pago.setActivo(true);

        return pagoRepository.save(pago);
    }

    @Override
    @Transactional
    public Optional<Pago> updatePago(Integer id, UpdatePagoDto dto) {
        Optional<Pago> pagoBuscado = pagoRepository.findById(id);

        if (pagoBuscado.isEmpty()) {
            return Optional.empty();
        }

        Pago pago = pagoBuscado.get();

        if (dto.metodo() != null) {
            pago.setMetodo(dto.metodo());
        }

        if (dto.monto() != null) {
            pago.setMonto(dto.monto());
        }

        if (dto.estadoPago() != null) {
            pago.setEstadoPago(dto.estadoPago());

            if (dto.estadoPago() == EstadoPago.CONFIRMADO && pago.getFechaPago() == null) {
                pago.setFechaPago(LocalDateTime.now());
            }
        }

        if (dto.fechaPago() != null) {
            pago.setFechaPago(convertirFecha(dto.fechaPago()));
        }

        if (dto.activo() != null) {
            pago.setActivo(dto.activo());
        }

        return Optional.of(pagoRepository.save(pago));
    }

    @Override
    @Transactional
    public Optional<Pago> deletePago(Integer id) {
        Optional<Pago> pagoBuscado = pagoRepository.findById(id);

        if (pagoBuscado.isEmpty()) {
            return Optional.empty();
        }

        Pago pago = pagoBuscado.get();

        pago.setActivo(false);

        if (pago.getEstadoPago() == EstadoPago.CONFIRMADO) {
            pago.setEstadoPago(EstadoPago.REEMBOLSADO);
        } else {
            pago.setEstadoPago(EstadoPago.FALLIDO);
        }

        return Optional.of(pagoRepository.save(pago));
    }

    private LocalDateTime convertirFecha(String fecha) {
        if (fecha == null || fecha.isBlank()) {
            return null;
        }

        if (fecha.length() == 10) {
            return java.time.LocalDate.parse(fecha).atStartOfDay();
        }

        return LocalDateTime.parse(fecha);
    }
}