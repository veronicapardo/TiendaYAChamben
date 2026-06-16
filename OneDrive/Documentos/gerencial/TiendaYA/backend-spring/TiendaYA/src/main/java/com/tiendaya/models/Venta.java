package com.tiendaya.models;

import com.tiendaya.models.enums.EstadoVenta;
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

    public void setEstadoVenta(EstadoVenta estadoVenta) {
        this.estadoVenta = estadoVenta;
    }

    public void setComprobante(String comprobante) {
        this.comprobante = comprobante;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}