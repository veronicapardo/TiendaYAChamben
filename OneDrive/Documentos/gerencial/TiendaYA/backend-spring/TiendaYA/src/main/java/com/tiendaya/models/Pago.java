package com.tiendaya.models;

import com.tiendaya.models.enums.EstadoPago;
import com.tiendaya.models.enums.MetodoPago;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "pedido_id", nullable = false, unique = true)
    private Pedido pedido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MetodoPago metodo;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_pago", nullable = false)
    private EstadoPago estadoPago = EstadoPago.PENDIENTE;

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Pago() {
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        if (this.estadoPago == null) {
            this.estadoPago = EstadoPago.PENDIENTE;
        }

        if (this.activo == null) {
            this.activo = true;
        }

        if (this.estadoPago == EstadoPago.CONFIRMADO && this.fechaPago == null) {
            this.fechaPago = LocalDateTime.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();

        if (this.estadoPago == EstadoPago.CONFIRMADO && this.fechaPago == null) {
            this.fechaPago = LocalDateTime.now();
        }
    }

    public Integer getId() {
        return id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public MetodoPago getMetodo() {
        return metodo;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public EstadoPago getEstadoPago() {
        return estadoPago;
    }

    public LocalDateTime getFechaPago() {
        return fechaPago;
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

    public void setMetodo(MetodoPago metodo) {
        this.metodo = metodo;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public void setEstadoPago(EstadoPago estadoPago) {
        this.estadoPago = estadoPago;
    }

    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}