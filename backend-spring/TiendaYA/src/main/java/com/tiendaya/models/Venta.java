package com.tiendaya.models;

import com.tiendaya.models.enums.EstadoVenta;
import com.tiendaya.models.enums.MetodoPago;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ventas")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "pedido_id", nullable = false, unique = true)
    private Pedido pedido;

    @OneToOne
    @JoinColumn(name = "pago_id", unique = true)
    private Pago pago;

    @Column(name = "fecha_venta", nullable = false)
    private LocalDateTime fechaVenta;

    @Column(name = "monto_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoTotal;

    @Column(name = "monto_efectivo", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoEfectivo = BigDecimal.ZERO;

    @Column(name = "monto_digital", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoDigital = BigDecimal.ZERO;

    @Column(name = "cambio", nullable = false, precision = 10, scale = 2)
    private BigDecimal cambio = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", nullable = false)
    private MetodoPago metodoPago;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_venta", nullable = false)
    private EstadoVenta estadoVenta = EstadoVenta.PENDIENTE;

    private String comprobante;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Venta() {
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        if (this.fechaVenta == null) {
            this.fechaVenta = LocalDateTime.now();
        }

        if (this.estadoVenta == null) {
            this.estadoVenta = EstadoVenta.PENDIENTE;
        }

        if (this.activo == null) {
            this.activo = true;
        }

        if (this.montoEfectivo == null) {
            this.montoEfectivo = BigDecimal.ZERO;
        }

        if (this.montoDigital == null) {
            this.montoDigital = BigDecimal.ZERO;
        }

        if (this.cambio == null) {
            this.cambio = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Integer getId() {
        return id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public Pago getPago() {
        return pago;
    }

    public LocalDateTime getFechaVenta() {
        return fechaVenta;
    }

    public BigDecimal getMontoTotal() {
        return montoTotal;
    }

    public MetodoPago getMetodoPago() {
        return metodoPago;
    }

    public EstadoVenta getEstadoVenta() {
        return estadoVenta;
    }

    public String getComprobante() {
        return comprobante;
    }

    public Boolean getActivo() {
        return activo;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public void setPago(Pago pago) {
        this.pago = pago;
    }

    public void setFechaVenta(LocalDateTime fechaVenta) {
        this.fechaVenta = fechaVenta;
    }

    public void setMontoTotal(BigDecimal montoTotal) {
        this.montoTotal = montoTotal;
    }


    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }

    public void setEstadoVenta(EstadoVenta estadoVenta) {
        this.estadoVenta = estadoVenta;
    }

    public void setComprobante(String comprobante) {
        this.comprobante = comprobante;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public BigDecimal getMontoEfectivo() {
        return montoEfectivo;
    }

    public void setMontoEfectivo(BigDecimal montoEfectivo) {
        this.montoEfectivo = montoEfectivo;
    }

    public BigDecimal getMontoDigital() {
        return montoDigital;
    }

    public void setMontoDigital(BigDecimal montoDigital) {
        this.montoDigital = montoDigital;
    }

    public BigDecimal getCambio() {
        return cambio;
    }

    public void setCambio(BigDecimal cambio) {
        this.cambio = cambio;
    }
}