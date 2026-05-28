package com.tiendaya.models;

import com.tiendaya.models.enums.EstadoFactura;
import com.tiendaya.models.enums.MetodoPago;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "facturas")
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "venta_id", nullable = false, unique = true)
    private Venta venta;

    @Column(name = "nit_ci", nullable = false, length = 50)
    private String nitCi;

    @Column(name = "razon_social", nullable = false, length = 255)
    private String razonSocial;

    @Column(name = "fecha_emision", nullable = false)
    private LocalDateTime fechaEmision;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", nullable = false)
    private MetodoPago metodoPago;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_factura", nullable = false)
    private EstadoFactura estadoFactura = EstadoFactura.EMITIDA;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Factura() {
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        if (this.fechaEmision == null) {
            this.fechaEmision = LocalDateTime.now();
        }

        if (this.estadoFactura == null) {
            this.estadoFactura = EstadoFactura.EMITIDA;
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

    public Venta getVenta() {
        return venta;
    }

    public String getNitCi() {
        return nitCi;
    }

    public String getRazonSocial() {
        return razonSocial;
    }

    public LocalDateTime getFechaEmision() {
        return fechaEmision;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public MetodoPago getMetodoPago() {
        return metodoPago;
    }

    public EstadoFactura getEstadoFactura() {
        return estadoFactura;
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

    public void setVenta(Venta venta) {
        this.venta = venta;
    }

    public void setNitCi(String nitCi) {
        this.nitCi = nitCi;
    }

    public void setRazonSocial(String razonSocial) {
        this.razonSocial = razonSocial;
    }

    public void setFechaEmision(LocalDateTime fechaEmision) {
        this.fechaEmision = fechaEmision;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }

    public void setEstadoFactura(EstadoFactura estadoFactura) {
        this.estadoFactura = estadoFactura;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}