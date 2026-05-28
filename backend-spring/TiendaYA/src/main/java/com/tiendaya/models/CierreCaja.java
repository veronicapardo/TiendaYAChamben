package com.tiendaya.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cierres_caja")
public class CierreCaja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "fecha_cierre", nullable = false)
    private LocalDateTime fechaCierre = LocalDateTime.now();

    @Column(name = "ventas_dia", nullable = false)
    private BigDecimal ventasDia = BigDecimal.ZERO;

    @Column(nullable = false)
    private Integer transacciones = 0;

    @Column(name = "facturas_emitidas", nullable = false)
    private Integer facturasEmitidas = 0;

    @Column(name = "pedidos_convertidos", nullable = false)
    private Integer pedidosConvertidos = 0;

    @Column(nullable = false)
    private BigDecimal efectivo = BigDecimal.ZERO;

    @Column(name = "qr_transferencias", nullable = false)
    private BigDecimal qrTransferencias = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal mixto = BigDecimal.ZERO;

    @Column(name = "envios_cobrados", nullable = false)
    private BigDecimal enviosCobrados = BigDecimal.ZERO;

    @Column(name = "descuentos_aplicados", nullable = false)
    private BigDecimal descuentosAplicados = BigDecimal.ZERO;

    @Column(name = "total_recaudado", nullable = false)
    private BigDecimal totalRecaudado = BigDecimal.ZERO;

    @Column(name = "monto_base_inicial", nullable = false)
    private BigDecimal montoBaseInicial = BigDecimal.ZERO;

    @Column(name = "efectivo_esperado", nullable = false)
    private BigDecimal efectivoEsperado = BigDecimal.ZERO;

    @Column(name = "efectivo_contado", nullable = false)
    private BigDecimal efectivoContado = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal diferencia = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(nullable = false, length = 30)
    private String estado = "LISTO_PARA_CERRAR";

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public CierreCaja() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public LocalDateTime getFechaCierre() {
        return fechaCierre;
    }

    public void setFechaCierre(LocalDateTime fechaCierre) {
        this.fechaCierre = fechaCierre;
    }

    public BigDecimal getVentasDia() {
        return ventasDia;
    }

    public void setVentasDia(BigDecimal ventasDia) {
        this.ventasDia = ventasDia;
    }

    public Integer getTransacciones() {
        return transacciones;
    }

    public void setTransacciones(Integer transacciones) {
        this.transacciones = transacciones;
    }

    public Integer getFacturasEmitidas() {
        return facturasEmitidas;
    }

    public void setFacturasEmitidas(Integer facturasEmitidas) {
        this.facturasEmitidas = facturasEmitidas;
    }

    public Integer getPedidosConvertidos() {
        return pedidosConvertidos;
    }

    public void setPedidosConvertidos(Integer pedidosConvertidos) {
        this.pedidosConvertidos = pedidosConvertidos;
    }

    public BigDecimal getEfectivo() {
        return efectivo;
    }

    public void setEfectivo(BigDecimal efectivo) {
        this.efectivo = efectivo;
    }

    public BigDecimal getQrTransferencias() {
        return qrTransferencias;
    }

    public void setQrTransferencias(BigDecimal qrTransferencias) {
        this.qrTransferencias = qrTransferencias;
    }

    public BigDecimal getMixto() {
        return mixto;
    }

    public void setMixto(BigDecimal mixto) {
        this.mixto = mixto;
    }

    public BigDecimal getEnviosCobrados() {
        return enviosCobrados;
    }

    public void setEnviosCobrados(BigDecimal enviosCobrados) {
        this.enviosCobrados = enviosCobrados;
    }

    public BigDecimal getDescuentosAplicados() {
        return descuentosAplicados;
    }

    public void setDescuentosAplicados(BigDecimal descuentosAplicados) {
        this.descuentosAplicados = descuentosAplicados;
    }

    public BigDecimal getTotalRecaudado() {
        return totalRecaudado;
    }

    public void setTotalRecaudado(BigDecimal totalRecaudado) {
        this.totalRecaudado = totalRecaudado;
    }

    public BigDecimal getMontoBaseInicial() {
        return montoBaseInicial;
    }

    public void setMontoBaseInicial(BigDecimal montoBaseInicial) {
        this.montoBaseInicial = montoBaseInicial;
    }

    public BigDecimal getEfectivoEsperado() {
        return efectivoEsperado;
    }

    public void setEfectivoEsperado(BigDecimal efectivoEsperado) {
        this.efectivoEsperado = efectivoEsperado;
    }

    public BigDecimal getEfectivoContado() {
        return efectivoContado;
    }

    public void setEfectivoContado(BigDecimal efectivoContado) {
        this.efectivoContado = efectivoContado;
    }

    public BigDecimal getDiferencia() {
        return diferencia;
    }

    public void setDiferencia(BigDecimal diferencia) {
        this.diferencia = diferencia;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}